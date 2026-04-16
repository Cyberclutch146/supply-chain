import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddShipment = () => {
  const navigate = useNavigate();
  const { addShipment } = useShipments();
  
  const [formData, setFormData] = useState({
    id: `SHP-${Math.floor(Math.random() * 90000) + 10000}`,
    origin: '',
    destination: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingTexts = [
    "Compiling Contract...",
    "Deploying to Network...",
    "Awaiting Confirmation..."
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) return;
    
    setIsSubmitting(true);
    setLoadingStep(0);
    
    await new Promise(r => setTimeout(r, 600));
    setLoadingStep(1);
    await new Promise(r => setTimeout(r, 800));
    setLoadingStep(2);
    await new Promise(r => setTimeout(r, 1000));
    
    await addShipment(formData);
    toast.success("Transaction Confirmed");
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
          <p className="text-xs text-on-surface-variant font-mono mt-1">Initiating New Contract on Ledger</p>
        </div>
      </header>
      
      <div className="glass-card rounded-xl p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(80,255,176,0.1)]">
        {isSubmitting && (
          <div className="absolute inset-0 z-50 bg-[#0b0e14]/80 backdrop-blur-md flex flex-col items-center justify-center rounded-xl border border-[#50ffb0]/20">
             <Loader2 className="w-12 h-12 text-[#50ffb0] animate-spin mb-4 drop-shadow-[0_0_10px_rgba(80,255,176,0.5)]" />
             <p className="text-[#50ffb0] font-mono tracking-wider animate-pulse transition-all duration-300">
               {loadingTexts[loadingStep]}
             </p>
          </div>
        )}
        
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
              disabled={isSubmitting}
              className="w-full bg-[#0b0e14] border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-[#50ffb0] focus:ring-1 focus:ring-[#50ffb0] transition-all font-mono text-sm disabled:opacity-50"
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
              disabled={isSubmitting}
              className="w-full bg-[#0b0e14] border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-[#50ffb0] focus:ring-1 focus:ring-[#50ffb0] transition-all font-mono text-sm disabled:opacity-50"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-6 py-4 rounded-lg font-bold shadow-[0_0_15px_rgba(80,255,176,0.3)] bg-[#50ffb0] text-[#0b0e14] flex justify-center items-center gap-2 hover:bg-[#6affc0] hover:scale-[0.98] active:scale-[0.96] hover:shadow-[0_0_25px_rgba(80,255,176,0.5)] transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
             {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={18} />}
             {isSubmitting ? "Processing..." : "Initialize Contract"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShipment;
