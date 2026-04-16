import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { ShieldCheck, AlertTriangle, Clock, MapPin, Activity } from 'lucide-react';

const ShipmentDetail = () => {
  const { id } = useParams();
  const { shipments, getShipmentMetrics } = useShipments();

  const shipment = shipments.find(s => s.id === id);

  if (!shipment) {
    return <div>Shipment not found.</div>;
  }

  const metrics = getShipmentMetrics(shipment.id);

  let riskClass = 'low';
  let riskText = 'Low Risk';
  if (metrics.riskScore >= 31) { riskClass = 'medium'; riskText = 'Medium Risk'; }
  if (metrics.riskScore >= 61) { riskClass = 'high'; riskText = 'High Risk'; }

  // Tamper detection simulation logic just for demo
  const isTampered = shipment.checkpoints.some(c => c.status === 'Tampered');

  return (
    <div>
      <div className="flex-between mb-4">
        <h2 className="text-lg">{shipment.id}</h2>
        <span className={`badge ${riskClass}`}>{riskText}</span>
      </div>

      <div className="flex-between mb-4">
        <Link to={`/add-checkpoint/${shipment.id}`} className="btn secondary" style={{ padding: '8px' }}>
          + Add Checkpoint
        </Link>
      </div>

      {/* Verification Panel */}
      <div className={`panel blockchain-verification ${isTampered ? 'tampered' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          {isTampered ? (
            <AlertTriangle size={20} color="var(--brand-danger)" />
          ) : (
            <ShieldCheck size={20} color="var(--brand-success)" />
          )}
          <h3 style={{ margin: 0, color: isTampered ? 'var(--brand-danger)' : 'var(--brand-success)' }}>
            {isTampered ? 'Data Integrity Compromised' : 'Verified on Chain'}
          </h3>
        </div>
        {!isTampered && (
          <div className="text-sm" style={{ fontFamily: 'monospace' }}>
            <div>Block: #102938</div>
            <div>Hash: 0xA3F...91D</div>
          </div>
        )}
      </div>

      {/* Delay Panel */}
      <div className="panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color={metrics.delayProb >= 75 ? 'var(--brand-danger)' : 'var(--text-secondary)'} />
          <h3 style={{ margin: 0 }}>Delay Prediction: {metrics.delayProb}%</h3>
        </div>
        <p className="text-sm mt-4" style={{ color: metrics.delayProb >= 75 ? 'var(--brand-danger)' : 'var(--text-secondary)' }}>
          <strong>Reason: </strong> {metrics.reason}
        </p>
      </div>

      {/* Driver Risk Panel */}
      <div className="panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} />
            <h3 style={{ margin: 0 }}>Driver Risk Score</h3>
          </div>
          <span className="text-lg">{metrics.riskScore}/100</span>
        </div>
        
        {/* Simple Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${metrics.riskScore}%`, 
            height: '100%', 
            background: riskClass === 'high' ? 'var(--brand-danger)' : riskClass === 'medium' ? 'var(--brand-warning)' : 'var(--brand-success)',
            transition: 'width 0.5s ease-out'
          }}></div>
        </div>

        <div className="text-sm mt-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Idle: {metrics.lastMetrics.idleTime}m</span>
          <span>Harsh Brakes: {metrics.lastMetrics.harshBrakes}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="panel">
        <h3>Journey Timeline</h3>
        <div className="timeline">
          {shipment.checkpoints.map((checkpoint, index) => (
            <div key={index} className="timeline-item">
              <div style={{ fontWeight: 600 }}>{checkpoint.location}</div>
              <div className="text-sm mb-2">{new Date(checkpoint.timestamp).toLocaleString()}</div>
              <div className="text-sm">
                Status: <span style={{ color: checkpoint.status === 'In Transit' ? 'var(--brand-primary)' : 'var(--text-secondary)' }}>{checkpoint.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ShipmentDetail;
