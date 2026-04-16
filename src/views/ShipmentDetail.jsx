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

  const isTampered = shipment.checkpoints.some(c => c.status === 'Tampered');

  return (
    <div>
      <div className="flex-between mb-4">
        <h2 className="text-lg">{shipment.id}</h2>
        {isTampered ? (
           <span className="badge danger">Data Tampered ❌</span>
        ) : (
           <span className={`badge ${riskClass}`}>{riskText}</span>
        )}
      </div>

      <div className="flex-between mb-4">
        <Link to={`/add-checkpoint/${shipment.id}`} className="btn secondary" style={{ padding: '8px' }}>
          + Add Checkpoint / Simulate Demo
        </Link>
      </div>

      {/* Explainable AI Risk Panel */}
      <div className="panel" style={{ borderLeft: `4px solid ${riskClass === 'high' ? 'var(--brand-danger)' : riskClass === 'medium' ? 'var(--brand-warning)' : 'var(--brand-success)'}` }}>
        <div className="flex-between mb-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} />
            <h3 style={{ margin: 0 }}>Explainable Delay Intelligence</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-lg font-bold">{metrics.delayProb}% Delay Prob</div>
          </div>
        </div>

        {metrics.breakdown && metrics.breakdown.length > 0 ? (
          <div>
            <div className="mb-2"><strong>Primary Cause:</strong> <span style={{color: 'var(--brand-danger)'}}>{metrics.breakdown[0]}</span></div>
            {metrics.breakdown.length > 1 && (
              <div className="mb-2"><strong>Secondary Cause:</strong> <span style={{color: 'var(--brand-warning)'}}>{metrics.breakdown[1]}</span></div>
            )}
            {metrics.breakdown.length > 2 && (
              <div className="text-sm mt-3 pt-3" style={{borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)'}}>
                <strong>Other Factors:</strong> {metrics.breakdown.slice(2).join(', ')}
              </div>
            )}
            
            <p className="text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
              <em>Explanation:</em> The AI has detected anomalies across these dimensions contributing to the increased probability of delay.
            </p>
          </div>
        ) : (
          <div className="text-sm" style={{color: 'var(--brand-success)'}}>No anomalies detected. Operations running nominally.</div>
        )}
      </div>

      {/* Provenance Ledger */}
      <div className="panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ShieldCheck size={20} color={isTampered ? 'var(--brand-danger)' : 'var(--brand-success)'} />
          <h3 style={{ margin: 0 }}>Provenance Ledger</h3>
        </div>
        <div className="timeline">
          {shipment.checkpoints.map((checkpoint, index) => (
            <div key={index} className="timeline-item">
              <div style={{ fontWeight: 600 }}>{checkpoint.location}</div>
              <div className="text-sm mb-1">{new Date(checkpoint.timestamp).toLocaleString()}</div>
              
              {checkpoint.txHash && (
                <div className="text-sm mb-2 p-2" style={{ fontFamily: 'monospace', background: 'var(--bg-primary)', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Tx: {checkpoint.txHash}</div>
                  <div style={{ marginTop: '4px', fontWeight: 'bold' }}>
                    {checkpoint.status === 'Tampered' ? (
                      <span style={{color: 'var(--brand-danger)'}}>❌ Tampered / Verification Failed</span>
                    ) : (
                      <span style={{color: 'var(--brand-success)'}}>✓ Block Verified</span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="text-sm mt-2">
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
