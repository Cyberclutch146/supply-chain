import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { ArrowLeft, Save } from 'lucide-react';

const AddShipment = () => {
  const navigate = useNavigate();
  const { addShipment } = useShipments();
  
  const [formData, setFormData] = useState({
    id: `SHP-${Math.floor(Math.random() * 90000) + 10000}`,
    origin: '',
    destination: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) return;
    
    addShipment(formData);
    navigate('/'); // redirect to dashboard
  };

  return (
    <div className="px-4 md:px-8 py-6 w-full max-w-2xl mx-auto flex flex-col gap-y-8">
      <header className="flex items-center gap-4 pb-2">
        <button onClick={() => navigate(-1)} className="text-[#50ffb0] hover:text-white transition-colors bg-[#50ffb0]/10 p-2 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Create Shipment</h2>
          <p className="text-xs text-on-surface-variant font-mono crypto-mono mt-1">Initiating New Contract on Ledger</p>
        </div>
      </header>
      
      <div className="glass-card rounded-xl p-6 md:p-8 relative overflow-hidden neon-border-hover transition-all duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Shipment ID (Auto-generated)</label>
            <input 
              type="text" 
              value={formData.id} 
              disabled 
              className="w-full bg-[#0b0e14] border border-outline-variant/30 text-on-surface-variant opacity-70 rounded-lg px-4 py-3 font-mono text-sm cursor-not-allowed"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Origin</label>
            <input 
              type="text" 
              placeholder="e.g. New York, US"
              value={formData.origin}
              onChange={e => setFormData({...formData, origin: e.target.value})}
              required
              className="w-full bg-[#0b0e14] border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-[#50ffb0] focus:ring-1 focus:ring-[#50ffb0] transition-all font-mono text-sm"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Destination</label>
            <input 
              type="text" 
              placeholder="e.g. London, UK"
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
              required
              className="w-full bg-[#0b0e14] border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-[#50ffb0] focus:ring-1 focus:ring-[#50ffb0] transition-all font-mono text-sm"
            />
          </div>
          
          <button type="submit" className="pulse-btn mt-6 py-4 rounded-lg font-bold shadow-neon flex justify-center items-center gap-2">
            <Save size={18} /> Initialize Contract
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShipment;
