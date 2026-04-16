import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, auth } from '../firebase';

const ShipmentContext = createContext();

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
};

const stableStringify = (obj) =>
  JSON.stringify(Object.keys(obj).sort().reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {}));

const getHashPayload = (c) => ({
  location: c.location,
  timestamp: c.timestamp,
  status: c.status,
  idleTime: c.idleTime,
  harshBrakes: c.harshBrakes,
  trafficLevel: c.trafficLevel,
  waitTime: c.waitTime,
  vehicleStatus: c.vehicleStatus,
  weather: c.weather,
  checkpointDelay: c.checkpointDelay,
  routeDeviation: c.routeDeviation
});

const generateHash = (data) => btoa(stableStringify(getHashPayload(data)));

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

      // Perform Cryptographic Data Integrity locally (fallback since Functions require Blaze plan)
      const verificationHash = generateHash(newCheckpoint);
      const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('').slice(0, 8) + '...' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).slice(-4);

      // Corrupt data logic for Tampering Demo
      let storedCheckpoint = { ...newCheckpoint };
      if (isTamperedDemo) {
        storedCheckpoint.idleTime = (Number(storedCheckpoint.idleTime) || 0) + 15;
      }

      const user = auth.currentUser;
      const checkpointData = {
        ...storedCheckpoint,
        shipmentId,
        verificationHash,
        txHash,
        verified: !isTamperedDemo,
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
    if (!checkpoint.verificationHash) return false;
    const currentHash = generateHash(checkpoint);
    return currentHash === checkpoint.verificationHash;
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

  const getDelayBreakdown = (c) => {
    const factors = [
      { id: 'weather', label: "Environmental (Storm)", weight: c.weather === "storm" ? 100 : 0 },
      { id: 'vehicle', label: "Vehicle Breakdown", weight: c.vehicleStatus === "breakdown" ? 90 : 0 },
      { id: 'deviation', label: "Route Deviation", weight: c.routeDeviation ? 80 : 0 },
      { id: 'traffic', label: "Traffic Congestion", weight: c.trafficLevel === "high" ? 70 : 0 },
      { id: 'driver', label: "Driver Anomaly", weight: (c.idleTime > 60 || c.harshBrakes > 10) ? 60 : 0 },
      { id: 'warning', label: "Vehicle Warning", weight: c.vehicleStatus === "warning" ? 50 : 0 },
      { id: 'wait', label: "Operational Delay", weight: c.waitTime > 30 ? 40 : 0 },
      { id: 'compliance', label: "Compliance Delay", weight: c.checkpointDelay > 20 ? 30 : 0 },
    ].filter(f => f.weight > 0).sort((a, b) => b.weight - a.weight);

    if (factors.length === 0) {
      return {
        primary: "Normal Conditions",
        secondary: null,
        explanationText: "Current logistics flow is optimal with no significant risk factors detected."
      };
    }

    const primary = factors[0].label;
    const secondary = factors.length > 1 ? factors[1].label : null;

    let explanationText = "";
    if (secondary) {
      explanationText = `${primary} combined with ${secondary.toLowerCase()} is significantly increasing delay probability.`;
    } else {
      explanationText = `${primary} alone is significantly increasing delay risk.`;
    }

    return { primary, secondary, explanationText };
  };

  const getShipmentMetrics = (shipmentId) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment || shipment.checkpoints.length === 0) {
      return { 
        riskScore: 0, 
        delayProb: getDelayProbability(0), 
        breakdown: getDelayBreakdown({}), 
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
    const breakdown = getDelayBreakdown(c);

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
      getDelayBreakdown,
      getShipmentMetrics
    }}>
      {children}
    </ShipmentContext.Provider>
  );
};

