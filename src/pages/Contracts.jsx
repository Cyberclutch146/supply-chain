import React, { useState } from 'react';
import { useShipments } from '../context/ShipmentContext';
import { toast } from 'react-hot-toast';

const Contracts = () => {
  const { shipments, addShipment } = useShipments();
  const [isDeploying, setIsDeploying] = useState(false);
  const [contractDetails, setContractDetails] = useState({
    item: '',
    origin: '',
    destination: '',
    value: ''
  });

  const generateHex = (len) => '0x' + [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

  const handleDeploy = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Compiling and deploying Smart Contract...');
    try {
      const newShipment = {
        id: generateHex(40),
        item: contractDetails.item,
        origin: contractDetails.origin,
        destination: contractDetails.destination,
        value: contractDetails.value,
        contractTx: generateHex(64),
        network: 'Ethereum (Sepolia)'
      };
      
      await addShipment(newShipment);
      toast.success('Smart Contract successfully deployed to ledger', { id: loadingToast });
      setIsDeploying(false);
      setContractDetails({ item: '', origin: '', destination: '', value: '' });
    } catch (error) {
      toast.error('Failed to deploy contract', { id: loadingToast });
    }
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Smart Contracts</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage active autonomous supply chain escrow contracts.</p>
        </div>
        <button 
          onClick={() => setIsDeploying(true)}
          className="bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg px-6 py-2.5 flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Deploy New Contract
        </button>
      </header>

      {isDeploying && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="glass-form p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-2xl font-bold text-on-surface">Configure Escrow</h2>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors" onClick={() => setIsDeploying(false)}>close</span>
            </div>
            
            <form onSubmit={handleDeploy} className="space-y-4">
              <div>
                <label className="text-xs text-on-surface-variant font-medium mb-1 block">Cargo Description</label>
                <input required value={contractDetails.item} onChange={e => setContractDetails({...contractDetails, item: e.target.value})} type="text" className="w-full bg-[#1c2028] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" placeholder="e.g. 500x NVIDIA H100 GPUs" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-on-surface-variant font-medium mb-1 block">Origin Node</label>
                  <input required value={contractDetails.origin} onChange={e => setContractDetails({...contractDetails, origin: e.target.value})} type="text" className="w-full bg-[#1c2028] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" placeholder="e.g. Taipei" />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant font-medium mb-1 block">Destination Node</label>
                  <input required value={contractDetails.destination} onChange={e => setContractDetails({...contractDetails, destination: e.target.value})} type="text" className="w-full bg-[#1c2028] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" placeholder="e.g. San Jose" />
                </div>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-medium mb-1 block">Escrow Value (USD)</label>
                <input required value={contractDetails.value} onChange={e => setContractDetails({...contractDetails, value: e.target.value})} type="number" min="0" className="w-full bg-[#1c2028] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" placeholder="15000000" />
              </div>
              
              <div className="pt-4">
                <button type="submit" className="w-full bg-primary text-on-surface font-semibold rounded-lg py-3 hover:bg-primary-container transition-colors">
                  Sign & Deploy to Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {shipments.map(s => (
          <div key={s.id} className="glass-card rounded-xl p-6 flex flex-col neon-border-hover transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded tracking-wide max-w-[200px] truncate block">{s.id}</span>
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${s.status === 'Delivered' ? 'bg-secondary-container/20 text-secondary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                {s.status === 'Delivered' ? 'Settled' : 'Active Escrow'}
              </span>
            </div>
            
            <div className="font-headline text-xl font-bold text-on-surface mb-1">{s.item}</div>
            
            <div className="grid grid-cols-2 gap-4 my-4 pb-4 border-b border-[rgba(69,72,79,0.2)]">
              <div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Route</div>
                <div className="text-sm font-medium text-on-surface truncate">{s.origin} <span className="text-primary mx-1">→</span> {s.destination}</div>
              </div>
              <div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Locked Value</div>
                <div className="text-sm font-medium text-on-surface">${Number(s.value || 0).toLocaleString()}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">enhanced_encryption</span>
                <span className="text-xs text-on-surface-variant">Multi-Sig Verified</span>
              </div>
              <div className="text-xs font-mono text-on-surface-variant/50 hover:text-primary transition-colors cursor-pointer truncate max-w-[150px]">
                Tx: {s.contractTx || generateHex(64)}
              </div>
            </div>
          </div>
        ))}

        {shipments.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-[rgba(69,72,79,0.2)] rounded-2xl flex flex-col items-center justify-center py-20 opacity-60">
            <span className="material-symbols-outlined text-4xl mb-4">receipt_long</span>
            <div className="font-headline text-xl text-on-surface">No Active Contracts</div>
            <div className="text-sm text-on-surface-variant mt-2">Deploy a new smart contract to begin tracking an asset.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contracts;
