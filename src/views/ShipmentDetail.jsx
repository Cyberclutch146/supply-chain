import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { ShieldCheck, AlertTriangle, Activity, ArrowLeft, Plus, CheckCircle } from 'lucide-react';

const ShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shipments, getShipmentMetrics } = useShipments();

  const shipment = shipments.find(s => s.id === id);

  if (!shipment) {
    return <div className="text-on-surface p-8">Shipment not found.</div>;
  }

  const metrics = getShipmentMetrics(shipment.id);

  const isHighRisk = metrics.riskScore >= 61;
  const isMedRisk = metrics.riskScore >= 31 && !isHighRisk;
  const riskClass = isHighRisk ? 'high' : isMedRisk ? 'medium' : 'low';
  
  const isTampered = shipment.checkpoints.some(c => c.status === 'Tampered');

  return (
    <div className="px-4 md:px-8 py-6 w-full flex flex-col gap-y-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center gap-4 pb-2">
        <button onClick={() => navigate(-1)} className="text-[#50ffb0] hover:text-white transition-colors bg-[#50ffb0]/10 p-2 rounded-full self-start md:self-auto">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight flex flex-wrap items-center gap-3">
            {shipment.id}
            {isTampered ? (
               <span className="bg-[#ff7162]/20 text-[#ff7162] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-[#ff7162]/30">
                 DATA TAMPERED ❌
               </span>
            ) : (
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${isHighRisk ? 'bg-[#ff7162]/20 text-[#ff7162] border-[#ff7162]/30' : isMedRisk ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30' : 'bg-[#50ffb0]/20 text-[#50ffb0] border-[#50ffb0]/30'}`}>
                 {isHighRisk ? 'CRITICAL RISK' : isMedRisk ? 'WARNING RISK' : 'SECURE'}
               </span>
            )}
          </h2>
        </div>
        <div className="md:ml-auto w-full md:w-auto">
          <Link to={`/add-checkpoint/${shipment.id}`} className="pulse-btn text-[#00482c] px-4 py-3 md:py-2 rounded-lg font-bold text-sm shadow-neon flex items-center justify-center gap-2">
            <Plus size={16} /> New Demo Event
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Explainable AI Risk Panel */}
        <div className={`glass-card rounded-xl p-6 relative overflow-hidden transition-all duration-300 ${isHighRisk ? 'border-t-4 border-t-[#ff7162]' : isMedRisk ? 'border-t-4 border-t-[#f59e0b]' : 'border-t-4 border-t-[#50ffb0]'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`${isHighRisk ? 'bg-[#ff7162]/10 text-[#ff7162]' : 'bg-[#50ffb0]/10 text-[#50ffb0]'} p-2 rounded-lg`}>
                <Activity size={24} />
              </div>
              <h3 className="font-headline font-semibold text-xl text-on-surface">Delay Intelligence</h3>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono crypto-mono text-on-surface">{metrics.delayProb}%</div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">Delay Prob</div>
            </div>
          </div>

          {metrics.breakdown && metrics.breakdown.length > 0 ? (
            <div className="flex flex-col gap-3 mt-4">
              <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-lg p-4">
                <div className="text-[10px] text-[#ff7162] font-bold uppercase tracking-wider mb-1">Primary Factor</div>
                <div className="text-sm font-semibold text-on-surface">{metrics.breakdown[0]}</div>
              </div>
              
              {metrics.breakdown.length > 1 && (
                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-lg p-4">
                  <div className="text-[10px] text-[#f59e0b] font-bold uppercase tracking-wider mb-1">Secondary Factor</div>
                  <div className="text-sm font-semibold text-on-surface">{metrics.breakdown[1]}</div>
                </div>
              )}
              
              {metrics.breakdown.length > 2 && (
                <div className="mt-2 text-xs text-on-surface-variant font-mono crypto-mono">
                  Additional Anomalies: <span className="text-on-surface">{metrics.breakdown.slice(2).join(' • ')}</span>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs leading-relaxed text-on-surface-variant">
                <span className="text-primary font-bold">AI.Reasoning:</span> The neural engine detected multi-dimensional anomalies contributing to this risk score. Requires immediate dispatch override.
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#50ffb0]/5 border border-[#50ffb0]/20 rounded-lg text-sm text-[#50ffb0] font-mono crypto-mono mt-4 flex items-center gap-2">
              <CheckCircle size={16} />  No anomalies detected. Sub-systems nominal. Route optimal.
            </div>
          )}
        </div>

        {/* Provenance Ledger */}
        <div className="glass-card rounded-xl p-6 relative flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck size={24} className={isTampered ? 'text-[#ff7162]' : 'text-[#50ffb0]'} />
            <h3 className="font-headline font-semibold text-xl text-on-surface">Provenance Ledger</h3>
          </div>
          
          <div className="relative pl-6 flex-1">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-4 w-px bg-outline-variant/30"></div>
            
            <div className="flex flex-col gap-6 relative">
              {shipment.checkpoints.map((checkpoint, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[30px] top-1 w-3 h-3 rounded-full border-2 border-[#1c2028] ${index === shipment.checkpoints.length - 1 ? 'bg-[#50ffb0] shadow-[0_0_10px_#50ffb0]' : 'bg-outline-variant'}`}></div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-on-surface text-sm">{checkpoint.location}</div>
                      <div className="text-[10px] font-mono crypto-mono text-on-surface-variant">{new Date(checkpoint.timestamp).toLocaleString()}</div>
                    </div>
                    
                    {checkpoint.txHash && (
                      <div className="mt-2 font-mono crypto-mono text-xs bg-[#0b0e14] border border-outline-variant/20 p-3 rounded-lg overflow-hidden flex flex-col gap-2 shadow-inner">
                        <div className="text-on-surface-variant break-all">Tx: <span className="text-on-surface opacity-80">{checkpoint.txHash}</span></div>
                        <div className="pt-1 mt-1 border-t border-outline-variant/10">
                          {checkpoint.status === 'Tampered' ? (
                            <span className="text-[#ff7162] font-bold flex items-center gap-1"><AlertTriangle size={12}/> Verification Failed (Block Rejected)</span>
                          ) : (
                            <span className="text-[#50ffb0] font-bold flex items-center gap-1"><CheckCircle size={12}/> Cryptographically Signed</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-[10px] text-on-surface-variant mt-1 font-mono uppercase tracking-wider">
                      State Transition: <span className={checkpoint.status === 'In Transit' ? 'text-primary font-bold' : 'text-on-surface font-bold'}>{checkpoint.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShipmentDetail;
