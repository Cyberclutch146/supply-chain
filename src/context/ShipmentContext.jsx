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

  useEffect(() => {
    const unsubShipments = onSnapshot(collection(db, 'shipments'), (snapshot) => {
      const ships = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShipmentsData(ships);
    });

    const unsubCheckpoints = onSnapshot(collection(db, 'checkpoints'), (snapshot) => {
      const chks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCheckpointsData(chks);
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
      console.error(e);
    }
  };

  const addCheckpoint = async (shipmentId, checkpoint, isTamperedDemo = false) => {
    try {
      let newCheckpoint = {
        ...checkpoint,
        timestamp: new Date().toISOString()
      };

      // 1. Backend Hashing & Blockchain tx generation via Cloud Function
      const logCheckpointFn = httpsCallable(functions, 'logCheckpoint');
      const logRes = await logCheckpointFn(newCheckpoint);
      const { verificationHash, txHash } = logRes.data;

      // Corrupt data logic for Tampering Demo
      let storedCheckpoint = { ...newCheckpoint };
      if (isTamperedDemo) {
        storedCheckpoint.idleTime = (Number(storedCheckpoint.idleTime) || 0) + 15;
      }

      // 2. AI Risk Analysis via Cloud Function
      const analyzeRiskFn = httpsCallable(functions, 'analyzeRisk');
      const aiRes = await analyzeRiskFn(storedCheckpoint);
      const aiInsight = aiRes.data;

      const user = auth.currentUser;
      const checkpointData = {
        ...storedCheckpoint,
        shipmentId,
        verificationHash,
        txHash,
        verified: !isTamperedDemo,
        aiInsight,
        createdBy: user ? user.uid : 'anonymous'
      };

      await addDoc(collection(db, 'checkpoints'), checkpointData);

      let updatedStatus = 'In Transit';
      if (checkpoint.status === 'Delivered') updatedStatus = 'Delivered';
      if (checkpoint.status === 'Stopped') updatedStatus = 'Delayed';

      const shipmentRef = doc(db, 'shipments', shipmentId);
      await updateDoc(shipmentRef, { status: isTamperedDemo ? 'Tampered' : updatedStatus });
      
    } catch (e) {
      console.error(e);
    }
  };

  const verifyHash = (checkpoint) => {
    // In a true hybrid model, the client shouldn't hash locally. 
    // We trust the backend signed `verified` flag for demo purposes.
    return checkpoint.verified;
  };

  const calculateRisk = (c) => {
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
    return Math.min(score, 100);
  };

  const getDelayProbability = (risk) => {
    if (risk < 30) return 20;
    if (risk < 60) return 50;
    return 75;
  };

  const getShipmentMetrics = (shipmentId) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment || shipment.checkpoints.length === 0) {
      return { 
        riskScore: 0, 
        delayProb: getDelayProbability(0), 
        breakdown: { primary: "Normal Conditions", secondary: null, explanationText: "Awaiting data" }, 
        lastMetrics: {} 
      };
    }

    const latest = shipment.checkpoints[0];
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

    const riskScore = calculateRisk(c);
    const delayProb = getDelayProbability(riskScore);
    const breakdown = latest.aiInsight || {
      primary: "Analyzing...", secondary: null, explanationText: "Awaiting AI insight."
    };

    return { riskScore, delayProb, breakdown, lastMetrics: c };
  };

  return (
    <ShipmentContext.Provider value={{
      shipments,
      addShipment,
      addCheckpoint,
      verifyHash,
      calculateRisk,
      getDelayProbability,
      getShipmentMetrics
    }}>
      {children}
    </ShipmentContext.Provider>
  );
};
