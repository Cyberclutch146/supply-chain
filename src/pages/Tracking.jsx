import React, { useState } from 'react';
import { useShipments } from '../context/ShipmentContext';
import { toast } from 'react-hot-toast';

const Tracking = () => {
  const { shipments, addCheckpoint } = useShipments();
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // New Checkpoint State
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('In Transit');
  const [weather, setWeather] = useState('clear');
  const [isTampered, setIsTampered] = useState(false);

  const activeShipment = shipments.find(s => s.id === selectedShipment) || null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCheckpoint = async (e) => {
    e.preventDefault();
    if (!activeShipment) return;
    setIsSubmitting(true);
    
    // Simulate some realistic mock data for AI
    const checkpoint = {
      location,
      status,
      weather,
      idleTime: Math.floor(Math.random() * 120),
      harshBrakes: Math.floor(Math.random() * 5),
      trafficLevel: Math.random() > 0.7 ? 'high' : 'low',
      waitTime: Math.floor(Math.random() * 60),
      vehicleStatus: 'ok',
      checkpointDelay: 0,
      routeDeviation: false
    };

    const loadingToast = toast.loading('Initializing Handshake...');
    try {
      await addCheckpoint(activeShipment.id, checkpoint, isTampered, (statusMsg) => {
        toast.loading(`${statusMsg}...`, { id: loadingToast });
      });
      toast.success('Confirmed ✅', { id: loadingToast });
      setIsAdding(false);
      setLocation('');
      setIsTampered(false);
    } catch (e) {
      toast.error('Transaction Failed', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex gap-6">
      {/* Left side: Shipments List */}
      <div className="w-1/3 flex flex-col pt-8">
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Live Tracking</h1>
        <p className="text-on-surface-variant text-sm mb-6">Select a shipment to view telemetry logs and AI risk insights.</p>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {shipments.map(s => (
            <div 
              key={s.id} 
              onClick={() => setSelectedShipment(s.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedShipment === s.id ? 'bg-[#1c2028] border-primary shadow-[0_0_20px_rgba(80,255,176,0.1)]' : 'bg-surface-container-low border-[rgba(69,72,79,0.15)] hover:border-primary/50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-on-surface-variant">ID: {s.id.substring(0,8)}</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${s.status === 'Delayed' || s.status === 'Tampered' ? 'text-tertiary' : 'text-primary'}`}>
                  {s.status}
                </span>
              </div>
              <div className="font-medium text-on-surface text-lg">{s.item}</div>
              <div className="text-xs text-on-surface-variant mt-1">Origin: {s.origin} • Dest: {s.destination}</div>
            </div>
          ))}
          {shipments.length === 0 && (
            <div className="text-on-surface-variant text-sm text-center py-8">No active shipments in network.</div>
          )}
        </div>
      </div>

      {/* Right side: Active Shipment Telemetry Timeline */}
      <div className="flex-1 glass-card rounded-2xl flex flex-col relative mt-8">
        {!activeShipment ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30">
            <span className="material-symbols-outlined text-6xl mb-4">radar</span>
            <div className="font-headline text-xl">Awaiting Selection</div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-[rgba(255,255,255,0.08)] bg-transparent flex justify-between items-center z-10">
              <div>
                <h2 className="font-headline text-2xl font-bold text-on-surface">{activeShipment.item}</h2>
                <div className="text-xs font-mono text-primary mt-1">Contract: {activeShipment.id}</div>
              </div>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isAdding ? 'Cancel' : 'Simulate Telemetry Event'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 relative">
              
              {isAdding && (
                <div className="mb-8 glass-form p-6 rounded-xl animate-in slide-in-from-top-4 duration-300">
                  <h3 className="font-headline font-semibold text-lg mb-4 text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">podcasts</span>
                    Node Data Ingestion
                  </h3>
                  <form onSubmit={handleAddCheckpoint}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs text-on-surface-variant font-medium mb-1 block">Location</label>
                        <input required value={location} onChange={e => setLocation(e.target.value)} type="text" className="w-full bg-[#1c2028] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary" placeholder="e.g. SGP Port" />
                      </div>
                      <div>
                        <label className="text-xs text-on-surface-variant font-medium mb-1 block">Status Report</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-[#1c2028] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary">
                          <option>In Transit</option>
                          <option>Stopped</option>
                          <option>Delivered</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-xs text-on-surface-variant font-medium mb-1 block">Local Weather (Mock Sensory)</label>
                        <select value={weather} onChange={e => setWeather(e.target.value)} className="w-full bg-[#1c2028] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary">
                          <option value="clear">Clear</option>
                          <option value="rain">Heavy Rain</option>
                          <option value="storm">Severe Storm</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center">
                            <input type="checkbox" checked={isTampered} onChange={e => setIsTampered(e.target.checked)} className="peer appearance-none w-5 h-5 border border-tertiary/50 rounded bg-transparent checked:bg-tertiary/20 checked:border-tertiary transition-colors" />
                            <span className="material-symbols-outlined text-tertiary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] pointer-events-none opacity-0 peer-checked:opacity-100 font-bold">close</span>
                          </div>
                          <span className="text-sm font-medium text-tertiary group-hover:text-tertiary-dim">Inject Bad Actor / Jamming Anomaly</span>
                        </label>
                      </div>
                    </div>
                    <button disabled={isSubmitting} type="submit" className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-semibold rounded-lg py-3 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-50 disabled:pointer-events-none">
                      <span className="material-symbols-outlined font-bold">memory</span>
                      Broadcast to Network
                    </button>
                  </form>
                </div>
              )}

              <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[27px] before:w-[2px] before:bg-outline-variant/10 ml-2">
                {activeShipment.checkpoints?.map((cp, idx) => (
                  <div key={idx} className="relative pl-14 group">
                    <div className={`absolute left-0 top-1 w-14 h-14 -translate-x-1/2 rounded-full flex items-center justify-center border-4 border-[#1c2028] z-10 ${cp.verified ? 'bg-primary/20 text-primary' : 'bg-tertiary/20 text-tertiary'}`}>
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{cp.verified ? 'check_circle' : 'gpp_bad'}</span>
                    </div>

                    <div className={`glass-subtle rounded-xl p-5 shadow-sm ${cp.verified ? 'hover:border-primary/40' : 'border-tertiary/40 shadow-[0_0_15px_rgba(255,113,98,0.1)]'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-headline font-bold text-on-surface text-lg">{cp.location}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${cp.verified ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'}`}>
                            {cp.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-on-surface-variant font-mono">{new Date(cp.timestamp).toLocaleString()}</div>
                          <div className="text-[10px] text-primary/80 mt-1 uppercase tracking-widest hidden md:block">Logged by Node {cp.createdBy ? cp.createdBy.substring(0,4) : 'ANON'}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">link</span> Blockchain Verification
                          </div>
                          <div className="bg-[#101217]/50 p-2 rounded border border-[rgba(255,255,255,0.05)] font-mono text-[10px] break-all leading-tight">
                            <div className="text-primary opacity-80 mb-1">Tx: {cp.txHash || 'Pending validation'}</div>
                            <div className="text-on-surface-variant opacity-60">ZKP: {cp.verificationHash || 'Pending evidence'}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">psychology</span> AI Telemetry Analysis
                          </div>
                          {cp.aiAnalysis ? (
                            <div className="bg-[#101217]/50 p-2 rounded border border-[rgba(255,255,255,0.05)] relative">
                              <div className={`text-xs font-semibold mb-1 pr-6 ${cp.verified || cp.aiAnalysis.riskScore < 50 ? 'text-primary' : 'text-tertiary'}`}>{cp.aiAnalysis.primary}</div>
                              <div className="text-[10px] text-on-surface-variant leading-relaxed">{cp.aiAnalysis.explanationText}</div>
                              {cp.aiAnalysis.analysisVersion && (
                                <div className="absolute top-2 right-2 text-[8px] font-mono text-on-surface-variant/50">{cp.aiAnalysis.analysisVersion}</div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-on-surface-variant italic">Pending consensus...</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!activeShipment.checkpoints || activeShipment.checkpoints.length === 0) && (
                  <div className="pl-14 text-on-surface-variant text-sm italic">
                    Awaiting first telemetry ping from hardware module.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tracking;
