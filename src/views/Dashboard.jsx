import React from 'react';
import { Link } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { Package, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { shipments, getShipmentMetrics } = useShipments();

  return (
    <div>
      <h2 className="mb-4">Active Shipments</h2>
      
      {shipments.map(shipment => {
        const metrics = getShipmentMetrics(shipment.id);
        
        let riskClass = 'low';
        let riskText = 'Low Risk';
        if (metrics.riskScore >= 31) { riskClass = 'medium'; riskText = 'Medium Risk'; }
        if (metrics.riskScore >= 61) { riskClass = 'high'; riskText = 'High Risk'; }

        return (
          <Link to={`/shipment/${shipment.id}`} key={shipment.id} className="card">
            <div className="flex-between mb-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="var(--brand-primary)" />
                <span className="text-lg">{shipment.id}</span>
              </div>
              <span className={`badge ${riskClass}`}>{riskText}</span>
            </div>
            
            <div className="text-sm mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} />
              {shipment.origin} &rarr; {shipment.destination}
            </div>
            
            <div className="flex-between text-sm">
              <span style={{ color: shipment.status === 'Delivered' ? 'var(--brand-success)' : shipment.status === 'Delayed' ? 'var(--brand-danger)' : 'var(--text-primary)' }}>
                {shipment.status}
              </span>
              <span>Delay Prob: {metrics.delayProb}%</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Dashboard;
