import React, { createContext, useState, useContext } from 'react';

const ShipmentContext = createContext();

export const useShipments = () => useContext(ShipmentContext);

const initialShipments = [
  {
    id: "SHP-10492",
    origin: "Shanghai, CN",
    destination: "Los Angeles, US",
    status: "In Transit",
    checkpoints: [
      {
        location: "Shanghai Port",
        timestamp: new Date(Date.now() - 48*60*60*1000).toISOString(),
        status: "In Transit",
        txHash: "0x8F9B...D2E1",
        idleTime: 12,
        harshBrakes: 0,
        trafficLevel: "low",
        waitTime: 5,
        vehicleStatus: "ok",
        weather: "clear",
        checkpointDelay: 0,
        routeDeviation: false
      }
    ]
  },
  {
    id: "SHP-99231",
    origin: "Berlin, DE",
    destination: "Paris, FR",
    status: "Delivered",
    checkpoints: [
      {
        location: "Paris Facility",
        timestamp: new Date(Date.now() - 24*60*60*1000).toISOString(),
        status: "Delivered",
        txHash: "0x3A2C...9F40",
        idleTime: 10,
        harshBrakes: 2,
        trafficLevel: "low",
        waitTime: 10,
        vehicleStatus: "ok",
        weather: "clear",
        checkpointDelay: 0,
        routeDeviation: false
      },
      {
        location: "Berlin Hub",
        timestamp: new Date(Date.now() - 72*60*60*1000).toISOString(),
        status: "In Transit",
        txHash: "0x1B4E...7C32",
        idleTime: 5,
        harshBrakes: 1,
        trafficLevel: "medium",
        waitTime: 30,
        vehicleStatus: "ok",
        weather: "rain",
        checkpointDelay: 10,
        routeDeviation: false
      }
    ]
  }
];

export const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState(initialShipments);

  const addShipment = (shipment) => {
    setShipments(prev => [{
      ...shipment,
      status: 'In Transit',
      checkpoints: []
    }, ...prev]);
  };

  const addCheckpoint = (shipmentId, checkpoint) => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        let updatedStatus = s.status;
        if (checkpoint.status === 'Delivered') updatedStatus = 'Delivered';
        if (checkpoint.status === 'Stopped') updatedStatus = 'Delayed';
        
        // Generate pseudo-random transaction hash to sell the blockchain provenance demo
        const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('').slice(0, 8) + '...' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('').slice(-4);

        return {
          ...s,
          status: updatedStatus,
          checkpoints: [{...checkpoint, timestamp: new Date().toISOString(), txHash}, ...s.checkpoints]
        };
      }
      return s;
    }));
  };

  const calculateRisk = (c) => {
    let score = 0;
    // Driver
    if (c.idleTime > 60) score += 15;
    if (c.harshBrakes > 10) score += 15;
    // Traffic
    if (c.trafficLevel === "high") score += 15;
    // Operational
    if (c.waitTime > 30) score += 10;
    // Vehicle
    if (c.vehicleStatus === "warning") score += 10;
    if (c.vehicleStatus === "breakdown") score += 25;
    // Environmental
    if (c.weather === "storm") score += 20;
    // Compliance
    if (c.checkpointDelay > 20) score += 10;
    // Deviation
    if (c.routeDeviation) score += 20;
    
    return Math.min(score, 100);
  };

  const calculateDelayProbability = (riskScore) => {
    if (riskScore < 20) return 15;
    if (riskScore < 50) return 40;
    if (riskScore < 70) return 70;
    return 85;
  };

  const getDelayBreakdown = (c) => {
    const reasons = [];
    if (c.weather === "storm") reasons.push("Environmental (Storm)");
    if (c.vehicleStatus === "breakdown") reasons.push("Vehicle (Breakdown)");
    if (c.routeDeviation) reasons.push("Route Deviation Alert");
    if (c.trafficLevel === "high") reasons.push("Traffic Delay");
    if (c.idleTime > 60 || c.harshBrakes > 10) reasons.push("Driver Anomaly");
    if (c.vehicleStatus === "warning") reasons.push("Vehicle Warning");
    if (c.waitTime > 30) reasons.push("Operational Delay");
    if (c.checkpointDelay > 20) reasons.push("Compliance/Border Delay");

    return reasons;
  };

  const getShipmentMetrics = (shipmentId) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment || shipment.checkpoints.length === 0) {
      return { riskScore: 0, delayProb: 15, breakdown: [], lastMetrics: {} };
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
    const delayProb = calculateDelayProbability(riskScore);
    const breakdown = getDelayBreakdown(c);

    return { 
      riskScore, 
      delayProb, 
      breakdown, 
      lastMetrics: c
    };
  };

  return (
    <ShipmentContext.Provider value={{
      shipments,
      addShipment,
      addCheckpoint,
      calculateRisk,
      calculateDelayProbability,
      getDelayBreakdown,
      getShipmentMetrics
    }}>
      {children}
    </ShipmentContext.Provider>
  );
};
