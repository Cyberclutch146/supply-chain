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
        idleTime: 12,
        harshBrakes: 0
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
        idleTime: 10,
        harshBrakes: 2
      },
      {
        location: "Berlin Hub",
        timestamp: new Date(Date.now() - 72*60*60*1000).toISOString(),
        status: "In Transit",
        idleTime: 5,
        harshBrakes: 1
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
        
        return {
          ...s,
          status: updatedStatus,
          checkpoints: [{...checkpoint, timestamp: new Date().toISOString()}, ...s.checkpoints]
        };
      }
      return s;
    }));
  };

  const calculateRisk = ({ idleTime, harshBrakes, stopCount = 0 }) => {
    let score = 0;
    if (idleTime > 30) score += 20;
    if (idleTime > 60) score += 15;
    if (harshBrakes > 5) score += 20;
    if (harshBrakes > 10) score += 20;
    if (stopCount > 3) score += 15;
    return Math.min(score, 100);
  };

  const calculateDelayProbability = (riskScore) => {
    if (riskScore < 30) return 20;
    if (riskScore < 60) return 50;
    return 75;
  };

  const getDelayReason = ({ idleTime, harshBrakes }) => {
    if (idleTime > 60 && harshBrakes > 10) return "High idle time + aggressive driving";
    if (idleTime > 60) return "High idle time at last checkpoint";
    if (harshBrakes > 10) return "Frequent harsh braking detected";
    if (idleTime > 30) return "Moderate idle time recorded";
    return "Normal conditions";
  };

  // Helper to aggregate risk for a shipment across all its checkpoints
  const getShipmentMetrics = (shipmentId) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment || shipment.checkpoints.length === 0) {
      return { riskScore: 0, delayProb: 20, reason: "No data", lastMetrics: { idleTime: 0, harshBrakes: 0} };
    }

    const latest = shipment.checkpoints[0]; // Assuming index 0 is latest
    const stopCount = shipment.checkpoints.filter(c => c.status === 'Stopped').length;
    
    // Convert to numbers explicitly
    const idleTime = Number(latest.idleTime) || 0;
    const harshBrakes = Number(latest.harshBrakes) || 0;

    const riskScore = calculateRisk({ idleTime, harshBrakes, stopCount });
    const delayProb = calculateDelayProbability(riskScore);
    const reason = getDelayReason({ idleTime, harshBrakes });

    return { 
      riskScore, 
      delayProb, 
      reason, 
      lastMetrics: { idleTime, harshBrakes }
    };
  };

  return (
    <ShipmentContext.Provider value={{
      shipments,
      addShipment,
      addCheckpoint,
      calculateRisk,
      calculateDelayProbability,
      getDelayReason,
      getShipmentMetrics
    }}>
      {children}
    </ShipmentContext.Provider>
  );
};
