import React from 'react';
import { Link } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { AlertTriangle, CheckCircle, BrainCircuit, Globe } from 'lucide-react';

const Dashboard = () => {
  const { shipments, getShipmentMetrics } = useShipments();

  return (
    <div className="px-4 md:px-8 py-6 w-full flex flex-col gap-y-8">
      {/* Top Header */}
      <header className="hidden md:flex items-center justify-between pb-2">
        <div>
          <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Fleet Intelligence</h2>
          <p className="text-sm text-on-surface-variant flex items-center gap-2 mt-1 font-mono crypto-mono">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Live Sync • Node {Math.floor(Math.random() * 100)}.A4
          </p>
        </div>
      </header>

      {/* Global Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group neon-border-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <p className="font-body text-sm font-medium text-on-surface-variant uppercase tracking-wider">Total Value Locked</p>
          </div>
          <h3 className="font-headline text-4xl font-bold text-on-surface mb-2">$4.28B</h3>
          <div className="flex items-center gap-2 text-sm mt-3">
             <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold">+2.4%</span>
             <span className="text-on-surface-variant font-mono text-xs">vs last epoch</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 relative overflow-hidden group neon-border-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <p className="font-body text-sm font-medium text-on-surface-variant uppercase tracking-wider">Active Smart Contracts</p>
          </div>
          <h3 className="font-headline text-4xl font-bold text-on-surface mb-2">1,842</h3>
          <div className="flex items-center gap-2 text-sm mt-3">
             <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold">99.8%</span>
             <span className="text-on-surface-variant font-mono text-xs">Verified execution</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 relative overflow-hidden group hover:border-[#ff7162]/50 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
             <p className="font-body text-sm font-medium text-on-surface-variant uppercase tracking-wider">Predictive Risk Nodes</p>
          </div>
          <h3 className="font-headline text-4xl font-bold text-[#ff7162] mb-2">{shipments.filter(s => getShipmentMetrics(s.id).riskScore > 30).length}</h3>
          <div className="flex items-center gap-2 text-sm mt-3">
             <span className="text-[#ff7162] bg-[#ff7162]/10 px-1.5 py-0.5 rounded font-bold">Needs Review</span>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column: Shipment List */}
        <div className="lg:col-span-2 flex flex-col gap-y-4">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-xl font-headline font-semibold text-on-surface">Active Fleet Ledger</h3>
           </div>
           
           <div className="flex flex-col gap-4">
             {shipments.map(shipment => {
               const metrics = getShipmentMetrics(shipment.id);
               const isHighRisk = metrics.riskScore >= 61;
               const isMedRisk = metrics.riskScore >= 31 && !isHighRisk;
               const primaryCause = metrics.breakdown?.primary;

               return (
                 <Link 
                   to={`/shipment/${shipment.id}`} 
                   key={shipment.id} 
                   className={`glass-card rounded-xl p-5 relative overflow-hidden transition-all duration-300 group cursor-pointer ${isHighRisk ? 'border-l-4 border-l-[#ff7162]' : isMedRisk ? 'border-l-4 border-l-[#f59e0b]' : 'neon-border-hover'}`}
                 >
                   {isHighRisk && <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#ff7162]/5 to-transparent pointer-events-none"></div>}
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="flex items-start gap-4 w-full">
                       <div className={`${isHighRisk ? 'bg-[#ff7162]/10 text-[#ff7162]' : 'bg-[#50ffb0]/10 text-[#50ffb0]'} p-2 rounded-lg mt-1`}>
                         {isHighRisk ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                       </div>
                       
                       <div className="flex-1">
                         <div className="flex justify-between items-start w-full mb-1">
                           <div className="flex items-center gap-2">
                             <h4 className="font-semibold text-on-surface">{shipment.id}</h4>
                             <span className={`${isHighRisk ? 'bg-[#ff7162]/20 text-[#ff7162]' : isMedRisk ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-[#50ffb0]/20 text-[#50ffb0]'} text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider`}>
                               {isHighRisk ? 'CRITICAL' : isMedRisk ? 'WARNING' : 'SECURE'}
                             </span>
                           </div>
                           <span className="text-sm font-medium text-on-surface">{metrics.delayProb}% Delay Prob</span>
                         </div>
                         
                         {primaryCause && (
                           <div className={`mt-2 mb-3 font-mono text-[10px] p-2 rounded border inline-block ${isHighRisk ? 'text-[#ff7162]/80 bg-[#ff7162]/5 border-[#ff7162]/10' : 'text-[#50ffb0]/80 bg-[#50ffb0]/5 border-[#50ffb0]/10'}`}>
                             AI.Analysis: {primaryCause}
                           </div>
                         )}
                         
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                           <div>
                             <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Origin</p>
                             <p className="text-sm text-on-surface">{shipment.origin}</p>
                           </div>
                           <div>
                             <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Destination</p>
                             <p className="text-sm text-on-surface">{shipment.destination}</p>
                           </div>
                           <div>
                             <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Status</p>
                             <p className="text-sm text-on-surface">{shipment.status}</p>
                           </div>
                           <div>
                             <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Risk Score</p>
                             <p className={`text-sm font-mono ${isHighRisk ? 'text-[#ff7162]' : isMedRisk ? 'text-[#f59e0b]' : 'text-[#50ffb0]'}`}>{metrics.riskScore}</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </Link>
               );
             })}
           </div>
        </div>

        {/* Right Column: AI Insight */}
        <div className="flex flex-col gap-y-6">
          <div className="glass-card rounded-xl p-6 relative bg-surface-container-lowest/80 border border-outline-variant/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-headline font-semibold text-on-surface flex items-center gap-2">
                 <BrainCircuit className="text-[#50ffb0]" size={20} /> Network Intelligence
               </h3>
               <span className="w-2 h-2 rounded-full bg-[#50ffb0] animate-ping"></span>
            </div>
            
            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono crypto-mono text-on-surface-variant">Model: GPT-O1-Secure</span>
                <span className="text-xs text-[#50ffb0] font-medium">99.2% Confidence</span>
              </div>
              <p className="text-sm text-on-surface leading-relaxed">
                Global supply chain flow is optimal. Continual syncing active on <span className="text-[#50ffb0] font-mono crypto-mono bg-[#50ffb0]/10 px-1 rounded">{shipments.length} Active Ledgers</span>. Keep monitoring.
              </p>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-1 h-64 relative overflow-hidden group">
            <div className="absolute inset-0 bg-surface-container-lowest opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(80, 255, 176, 0.1) 0%, transparent 60%)' }}></div>
            <div className="absolute bottom-4 left-4">
               <p className="text-xs font-mono crypto-mono text-[#50ffb0] font-bold shadow-black drop-shadow-md">LIVE VIEW</p>
               <p className="text-sm font-semibold text-white drop-shadow-md">Global Fleet Deployment</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-[#50ffb0]">
               <Globe size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
