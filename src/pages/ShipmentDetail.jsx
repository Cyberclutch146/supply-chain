import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { ShieldCheck, AlertTriangle, Activity, ArrowLeft, Plus, CheckCircle, Zap } from 'lucide-react';

const ShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    shipments, 
    verifyHash, 
    calculateRisk, 
    getDelayProbability, 
    getShipmentMetrics 
  } = useShipments();

  const [isSimulated, setIsSimulated] = useState(false);

  const shipment = shipments.find(s => s.id === id);

  const metrics = useMemo(() => {
    if (!shipment) return null;
    if (!isSimulated) return getShipmentMetrics(shipment.id);

    // Simulated State Injection (Derived Object - No Mutation)
    const latest = shipment.checkpoints[0] || {};
    const simulatedCheckpoint = {
      idleTime: Number(latest.idleTime) || 0,
      harshBrakes: Number(latest.harshBrakes) || 0,
      trafficLevel: "high", // Injected
      waitTime: Number(latest.waitTime) || 0,
      vehicleStatus: latest.vehicleStatus || 'ok',
      weather: "storm", // Injected
      checkpointDelay: Number(latest.checkpointDelay) || 0,
      routeDeviation: Boolean(latest.routeDeviation)
    };

    const riskScore = calculateRisk(simulatedCheckpoint);
    const delayProb = getDelayProbability(riskScore);
    const breakdown = {
      primary: "Environmental (Storm)",
      secondary: "Traffic Congestion",
      explanationText: "Environmental (Storm) combined with traffic congestion is significantly increasing delay probability. Immediate re-routing advised."
    };

    return { riskScore, delayProb, breakdown, lastMetrics: simulatedCheckpoint };
  }, [shipment, isSimulated, getShipmentMetrics, calculateRisk, getDelayProbability]);

  if (!shipment) {
    return <div className="text-on-surface p-8">Shipment not found.</div>;
  }

  const isHighRisk = metrics.riskScore >= 61;
  const isMedRisk = metrics.riskScore >= 31 && !isHighRisk;
  
  // Dynamic Ledger Integrity Check
  const ledgerIntegrity = shipment.checkpoints.map(c => ({
    ...c,
    isVerified: verifyHash(c)
  }));
  const hasTamperedEntry = ledgerIntegrity.some(c => !c.isVerified);

  return (
    <div className="px-4 md:px-8 py-6 w-full flex flex-col gap-y-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center gap-4 pb-2">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-[#50ffb0] hover:text-white transition-colors bg-[#50ffb0]/10 p-2 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight flex flex-wrap items-center gap-3">
              {shipment.id}
              {hasTamperedEntry ? (
                 <span className="bg-[#ff7162]/20 text-[#ff7162] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-[#ff7162]/30 animate-pulse">
                   INTEGRITY BREACH detected ❌
                 </span>
              ) : (
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${isHighRisk ? 'bg-[#ff7162]/20 text-[#ff7162] border-[#ff7162]/30' : isMedRisk ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30' : 'bg-[#50ffb0]/20 text-[#50ffb0] border-[#50ffb0]/30'}`}>
                   {isHighRisk ? 'CRITICAL RISK' : isMedRisk ? 'WARNING RISK' : 'SECURE'}
                 </span>
              )}
            </h2>
          </div>
        </div>

        {/* Demo Toggle */}
        <div className="relative flex bg-[#0b0e14] rounded-lg p-1 border border-outline-variant/30 md:ml-6 mt-2 md:mt-0 shadow-inner">
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md transition-all duration-300 ease-out z-0 ${isSimulated ? 'translate-x-[calc(100%+8px)] bg-[#ff7162]/20 border border-[#ff7162]/30 shadow-[0_0_10px_rgba(255,113,98,0.3)]' : 'translate-x-0 bg-[#50ffb0]/20 border border-[#50ffb0]/30 shadow-[0_0_10px_rgba(80,255,176,0.3)]'}`}></div>
          <button 
            onClick={() => setIsSimulated(false)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all z-10 w-28 text-center flex justify-center items-center ${!isSimulated ? 'text-[#50ffb0] drop-shadow-[0_0_5px_rgba(80,255,176,0.8)]' : 'text-on-surface-variant hover:text-white'}`}
          >
            NORMAL
          </button>
          <button 
            onClick={() => setIsSimulated(true)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex justify-center items-center gap-1 z-10 w-36 text-center ${isSimulated ? 'text-[#ff7162] drop-shadow-[0_0_5px_rgba(255,113,98,0.8)]' : 'text-on-surface-variant hover:text-[#ff7162]'}`}
          >
            <Zap size={12} /> SIMULATED
          </button>
        </div>

        <div className="md:ml-auto w-full md:w-auto mt-2 md:mt-0">
          <Link to={`/add-checkpoint/${shipment.id}`} className="text-[#0b0e14] px-4 py-3 md:py-2.5 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(80,255,176,0.4)] bg-[#50ffb0] flex items-center justify-center gap-2 hover:bg-[#6affc0] hover:scale-[0.98] active:scale-[0.96] hover:shadow-[0_0_25px_rgba(80,255,176,0.6)] transition-all duration-200">
            <Plus size={18} /> New Demo Event
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
              <div className={`text-3xl font-bold font-mono crypto-mono transition-colors ${isHighRisk ? 'text-[#ff7162]' : 'text-on-surface'}`}>{metrics.delayProb}%</div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">Predictive Prob</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {/* Primary Factor - Highlighted */}
            <div className={`border rounded-lg p-5 transition-all duration-500 ${isHighRisk ? 'bg-[#ff7162]/10 border-[#ff7162]/30 shadow-[0_0_15px_rgba(255,113,98,0.15)]' : 'bg-surface-container-lowest border-outline-variant/10'}`}>
              <div className={`text-xs font-black uppercase tracking-wider mb-2 ${isHighRisk ? 'text-[#ff7162]' : 'text-on-surface-variant'}`}>Primary Factor</div>
              <div className={`text-2xl font-black ${isHighRisk ? 'text-white' : 'text-on-surface'}`}>{metrics.breakdown.primary}</div>
            </div>
            
            {/* Secondary Factor - Subtle */}
            {metrics.breakdown.secondary && (
              <div className="bg-surface-container-lowest border border-outline-variant/5 rounded-lg p-4 opacity-70">
                <div className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider mb-1">Secondary Factor</div>
                <div className="text-xs font-medium text-on-surface-variant/80">{metrics.breakdown.secondary}</div>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-[10px] text-primary font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                <BrainCircuit size={12} /> AI Reasoning Engine
              </div>
              <p className="text-sm leading-relaxed text-[#50ffb0]/70 italic mt-2">
                "{metrics.breakdown.explanationText}"
              </p>
            </div>
          </div>
        </div>

        {/* Provenance Ledger */}
        <div className="glass-card rounded-xl p-6 relative flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck size={24} className={hasTamperedEntry ? 'text-[#ff7162]' : 'text-[#50ffb0]'} />
            <h3 className="font-headline font-semibold text-xl text-on-surface">Verification Hub (Sovereign Ledger)</h3>
          </div>
          
          <div className="relative pl-6 flex-1">
            <div className="absolute left-[11px] top-2 bottom-4 w-px bg-outline-variant/30"></div>
            
            <div className="flex flex-col gap-6 relative">
              {ledgerIntegrity.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-[#0b0e14]/50 rounded-xl border border-outline-variant/10 text-center">
                  <p className="text-lg font-bold text-on-surface mb-2">No Ledger Events Yet</p>
                  <p className="text-sm text-on-surface-variant font-mono">Add your first checkpoint to activate intelligence.</p>
                </div>
              ) : ledgerIntegrity.map((checkpoint, index) => {
                const isVerified = checkpoint.isVerified;
                const txHash = checkpoint.txHash || '0xPENDING';
                const verificationHash = checkpoint.verificationHash ? `${checkpoint.verificationHash.substring(0, 16)}...` : 'unhashed_legacy';
                return (
                  <div key={index} className="relative group">
                    <div className={`absolute -left-[30px] top-1 w-3 h-3 rounded-full border-2 border-[#1c2028] transition-all duration-300 ${isVerified ? 'bg-[#50ffb0] shadow-[0_0_10px_#50ffb0] group-hover:scale-125' : 'bg-[#ff7162] shadow-[0_0_15px_#ff7162] animate-pulse'}`}></div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-on-surface text-sm">{checkpoint.location}</div>
                        <div className="text-[10px] font-mono crypto-mono text-on-surface-variant">Block Timestamp: {new Date(checkpoint.timestamp).toLocaleTimeString()}</div>
                      </div>
                      
                      <div className="mt-2 font-mono crypto-mono text-xs bg-[#0b0e14] border border-outline-variant/20 p-4 rounded-lg overflow-hidden flex flex-col gap-3 shadow-inner hover:border-outline-variant/40 transition-colors">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-on-surface-variant truncate">Tx: <span className="text-[#50ffb0]">{txHash}</span></div>
                          <div className="text-on-surface-variant text-right">Status: <span className="text-white bg-on-surface-variant/20 px-2 py-0.5 rounded">Confirmed</span></div>
                        </div>
                        <div className="text-on-surface-variant truncate opacity-50">Payload Hash: <span className="italic">{verificationHash}</span></div>
                        
                        <div className="pt-2 mt-1 border-t border-outline-variant/10">
                          {!isVerified ? (
                            <div className="text-[#ff7162] font-bold flex items-center gap-2 text-[10px] animate-pulse">
                              <AlertTriangle size={14}/> DATA INTEGRITY COMPROMISED
                            </div>
                          ) : (
                            <div className="text-[#50ffb0] font-bold flex items-center gap-2 text-[10px] drop-shadow-[0_0_5px_rgba(80,255,176,0.6)]">
                              <CheckCircle size={14}/> CRYPTOGRAPHICALLY VERIFIED
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Simple Lucide replacement if missing
const BrainCircuit = ({ size }) => <Activity size={size} />;

export default ShipmentDetail;

