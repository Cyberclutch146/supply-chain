import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, auth } from '../services/firebase';

const ShipmentContext = createContext();

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
};

export const ShipmentProvider = ({ children }) => {
  const [shipmentsData, setShipmentsData] = useState([]);
  const [checkpointsData, setCheckpointsData] = useState([]);
  const [isLoadingShipments, setIsLoadingShipments] = useState(true);

  useEffect(() => {
    let shipmentsLoaded = false;
    let checkpointsLoaded = false;

    const unsubShipments = onSnapshot(collection(db, 'shipments'), (snapshot) => {
      const ships = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShipmentsData(ships);
      shipmentsLoaded = true;
      if (shipmentsLoaded && checkpointsLoaded) setIsLoadingShipments(false);
    });

    const unsubCheckpoints = onSnapshot(collection(db, 'checkpoints'), (snapshot) => {
      const chks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCheckpointsData(chks);
      checkpointsLoaded = true;
      if (shipmentsLoaded && checkpointsLoaded) setIsLoadingShipments(false);
    });

    return () => {
      unsubShipments();
      unsubCheckpoints();
    };
  }, []);

  const shipments = useMemo(() => {
    return shipmentsData.map(s => {
      const sCheckpoints = checkpointsData
        .filter(c => c.shipmentId === s.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return { ...s, checkpoints: sCheckpoints };
    });
  }, [shipmentsData, checkpointsData]);

  const addShipment = async (shipment) => {
    try {
      const user = auth.currentUser;
      const docRef = doc(db, 'shipments', shipment.id);
      await setDoc(docRef, {
        ...shipment,
        status: 'In Transit',
        createdAt: new Date().toISOString(),
        createdBy: user ? user.uid : 'anonymous'
      });
    } catch (e) {
      console.error("Failed to add shipment:", e);
      throw e;
    }
  };

  const addCheckpoint = async (shipmentId, checkpoint, isTamperedDemo = false, onProgressUpdate) => {
    try {
      let newCheckpoint = {
        ...checkpoint,
        timestamp: new Date().toISOString()
      };

      if (isTamperedDemo) {
        newCheckpoint.idleTime = (Number(newCheckpoint.idleTime) || 0) + 15;
      }

      if (onProgressUpdate) onProgressUpdate('Signing');
      let verificationHash, txHash;
      try {
        const logCheckpointFunc = httpsCallable(functions, 'logCheckpoint');
        const logRes = await logCheckpointFunc(newCheckpoint);
        verificationHash = logRes.data.verificationHash;
        txHash = logRes.data.txHash;
      } catch (e) {
        console.warn("Cloud function logCheckpoint failed, using local fallback.", e);
        // Fallback mock logic
        await new Promise(res => setTimeout(res, 800));
        verificationHash = Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        txHash = "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      }

      if (onProgressUpdate) onProgressUpdate('Broadcasting');
      let aiData = {};
      try {
        const analyzeRiskFunc = httpsCallable(functions, 'analyzeRisk');
        const aiRes = await analyzeRiskFunc(newCheckpoint);
        aiData = aiRes.data || {};
      } catch (e) {
        console.warn("Cloud function analyzeRisk failed, using local fallback.", e);
        await new Promise(res => setTimeout(res, 800));
        
        const c = { ...newCheckpoint };
        let score = 0;
        if (c.idleTime > 60) score += 15;
        if (c.harshBrakes > 10) score += 15;
        if (c.trafficLevel === "high") score += 15;
        if (c.waitTime > 30) score += 10;
        if (c.vehicleStatus === "warning") score += 10;
        if (c.vehicleStatus === "breakdown") score += 25;
        if (c.weather === "storm") score += 20;
        if (c.checkpointDelay > 20) score += 10;
        if (c.routeDeviation) score += 20;
        const riskScore = Math.min(score, 100);
        const delayProb = riskScore < 30 ? 20 : riskScore < 60 ? 50 : 75;

        aiData = {
          riskScore,
          delayProb,
          primary: riskScore > 50 ? "High Risk Detected" : "Normal Conditions",
          secondary: null,
          explanationText: riskScore > 50 ? "Multiple risk factors indicate potential delays." : "Current logistics flow is optimal.",
          analysisTimestamp: Date.now(),
          analysisVersion: "v1-fallback"
        };
      }
      
      if (onProgressUpdate) onProgressUpdate('Finalizing');

      const user = auth.currentUser;
      const checkpointData = {
        ...newCheckpoint,
        shipmentId,
        verificationHash,
        txHash,
        verified: !isTamperedDemo,
        createdBy: user ? user.uid : 'anonymous',
        aiAnalysis: {
          riskScore: aiData.riskScore || 0,
          delayProb: aiData.delayProb || 20,
          primary: aiData.primary || 'Analysis unavailable',
          secondary: aiData.secondary || null,
          explanationText: aiData.explanationText || 'Risk analysis service temporarily unavailable.',
          analysisTimestamp: Date.now(),
          analysisVersion: aiData.analysisVersion || "v1"
        }
      };

      await addDoc(collection(db, 'checkpoints'), checkpointData);

      let updatedStatus = 'In Transit';
      if (checkpoint.status === 'Delivered') updatedStatus = 'Delivered';
      if (checkpoint.status === 'Stopped') updatedStatus = 'Delayed';

      const shipmentRef = doc(db, 'shipments', shipmentId);
      await updateDoc(shipmentRef, { status: isTamperedDemo ? 'Tampered' : updatedStatus });
      
      if (onProgressUpdate) onProgressUpdate('Confirmed');

    } catch (e) {
      console.error("Failed to add checkpoint", e);
      throw e; // Rethrow to let the UI component handle it with a toast message
    }
  };

  const verifyHash = (checkpoint) => {
    // Basic local hash verification check could be here if required,
    // though real verification should happen backend/on-chain.
    return checkpoint.verified; 
  };

  const getShipmentMetrics = (shipmentId) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    
    if (!shipment || !shipment.checkpoints || shipment.checkpoints.length === 0) {
      return { 
        riskScore: 0, 
        delayProb: 20, 
        breakdown: {
          primary: "Normal Conditions",
          secondary: null,
          explanationText: "Awaiting tracking events."
        }, 
        lastMetrics: {} 
      };
    }

    const latest = shipment.checkpoints.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    const aiAnalysis = latest.aiAnalysis || {};

    const c = {
      idleTime: Number(latest.idleTime) || 0,
      harshBrakes: Number(latest.harshBrakes) || 0,
      trafficLevel: latest.trafficLevel || 'low',
      waitTime: Number(latest.waitTime) || 0,
      vehicleStatus: latest.vehicleStatus || 'ok',
      weather: latest.weather || 'clear',
      checkpointDelay: Number(latest.checkpointDelay) || 0,
      routeDeviation: Boolean(latest.routeDeviation)
    };

    const riskScore = aiAnalysis.riskScore || 0;
    const delayProb = aiAnalysis.delayProb || 20;
    const breakdown = {
       primary: aiAnalysis.primary || "Analysis unavailable",
       secondary: aiAnalysis.secondary || null,
       explanationText: aiAnalysis.explanationText || "Current logistics flow is optimal.",
       analysisVersion: aiAnalysis.analysisVersion,
       analysisTimestamp: aiAnalysis.analysisTimestamp
    };

    return { riskScore, delayProb, breakdown, lastMetrics: c };
  };

  return (
    <ShipmentContext.Provider value={{
      shipments,
      isLoadingShipments,
      addShipment,
      addCheckpoint,
      verifyHash,
      getShipmentMetrics
    }}>
      {children}
    </ShipmentContext.Provider>
  );
};
