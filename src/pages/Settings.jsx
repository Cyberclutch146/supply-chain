import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const Settings = () => {
  const { currentUser, nodeId: activeNodeId } = useAuth();
  const [nodeId, setNodeId] = useState(activeNodeId || '042');
  const [threshold, setRiskThreshold] = useState('60');

  useEffect(() => {
    if (activeNodeId) setNodeId(activeNodeId);
  }, [activeNodeId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        nodeId: nodeId
      }, { merge: true });
      toast.success('Settings synchronized to node.');
    } catch (err) {
      toast.error('Failed to synchronize settings');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <header className="mb-8">
          <h1 className="font-headline text-3xl font-bold text-on-surface">System Configuration</h1>
          <p className="text-on-surface-variant text-sm mt-1">Configure your local node identity and AI risk tolerances.</p>
        </header>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Node Identity Card */}
          <div className="bg-[#1c2028]/80 backdrop-blur-md border border-[rgba(69,72,79,0.15)] rounded-2xl p-6">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">badge</span>
              Node Identity
            </h2>
            <p className="text-sm text-on-surface-variant mb-6">This identifier is attached to any checkpoint payloads you broadcast to the network.</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-on-surface-variant font-medium mb-1 block">Local Node ID</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-mono">Node-</span>
                  <input required value={nodeId} onChange={e => setNodeId(e.target.value)} type="text" className="w-full bg-surface-container-highest border border-[rgba(69,72,79,0.2)] rounded-lg pl-14 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary font-mono" placeholder="042" />
                </div>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-medium mb-1 block">Cryptographic Key Role</label>
                <select className="w-full bg-surface-container-highest border border-[rgba(69,72,79,0.2)] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary opacity-70 cursor-not-allowed" disabled>
                  <option>Primary Verifier</option>
                  <option>Read-only Auditor</option>
                </select>
                <div className="text-[10px] text-tertiary mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">lock</span> Hardware locked</div>
              </div>
            </div>
          </div>

          {/* AI Threat Configuration */}
          <div className="bg-[#1c2028]/80 backdrop-blur-md border border-[rgba(69,72,79,0.15)] rounded-2xl p-6">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">psychology</span>
              AI Risk Engine
            </h2>
            <p className="text-sm text-on-surface-variant mb-6">Configure at what threshold the AI flags a shipment as an anomaly requiring manual review.</p>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs text-on-surface-variant font-medium block">Anomaly Threshold Level</label>
                <span className="font-mono text-primary font-bold">{threshold}% Risk Score</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={threshold} 
                onChange={(e) => setRiskThreshold(e.target.value)}
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant mt-2 font-mono">
                <span>0% (Hyper Sensitive)</span>
                <span>100% (Permissive)</span>
              </div>
            </div>
          </div>

          {/* Network Connection */}
          <div className="bg-[#1c2028]/80 backdrop-blur-md border border-[rgba(69,72,79,0.15)] rounded-2xl p-6 opacity-60">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">router</span>
              Network Layer
            </h2>
            <div className="flex items-center gap-4 bg-surface-container-highest p-4 rounded-lg border border-[rgba(69,72,79,0.2)]">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary">
                <span className="material-symbols-outlined text-primary">wifi_tethering</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-on-surface">RPC Endpoint Connected</div>
                <div className="text-xs text-on-surface-variant font-mono">wss://global-ledger.nexus/v1/ws</div>
              </div>
              <span className="text-xs text-primary font-bold tracking-widest uppercase bg-primary/10 px-2 py-1 rounded">Live</span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg px-8 py-3 transition-colors shadow-lg shadow-primary/20">
              Apply Configurations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
