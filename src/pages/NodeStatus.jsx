import React from 'react';
import { Network, Activity, Server, Zap } from 'lucide-react';

const NodeStatus = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#ecedf6] flex items-center gap-3">
            <Network className="text-[#50ffb0]" size={32} />
            Global Node Status
          </h1>
          <p className="text-[#a9abb3] text-sm mt-2">
            Real-time visualization of the decentralized supply chain tracking network.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#1c2028] px-4 py-2 rounded-lg border border-[#45484f]/20">
          <div className="w-2 h-2 rounded-full bg-[#50ffb0] animate-pulse"></div>
          <span className="text-sm font-mono text-[#50ffb0]">Network Healthy</span>
        </div>
      </header>

      {/* Map Visualization */}
      <div className="bg-[#1c2028]/80 backdrop-blur rounded-xl border border-[#45484f]/20 p-6 relative min-h-[500px] overflow-hidden group">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#ecedf6]">Neural Network Map</h3>
          <div className="flex gap-4">
            <span className="flex items-center gap-2 text-xs text-[#a9abb3]"><div className="w-2 h-2 rounded-full bg-[#50ffb0]"></div> Verified Nodes</span>
            <span className="flex items-center gap-2 text-xs text-[#a9abb3]"><div className="w-2 h-2 rounded-full bg-[#c5d0ec]"></div> Pending Sync</span>
            <span className="flex items-center gap-2 text-xs text-[#a9abb3]"><div className="w-2 h-2 rounded-full bg-[#ff7162]"></div> Offline / Alert</span>
          </div>
        </div>

        {/* The Matrix style abstract map */}
        <div className="absolute inset-0 top-16 flex items-center justify-center opacity-80 pointer-events-none">
          <img 
            alt="World Map Tech" 
            className="w-full h-full object-cover mix-blend-screen opacity-40 group-hover:opacity-60 transition-opacity duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtP-RXhGhEKnpYyUEDUmZlD8U0go5l7mTdSfNxnEtq7Mogua8fEHZ1TyagMGo7WoJAQsCvK8uEmqnDLcntj5bA6ydJZJDhaBe7xqWatEKFYCOtPK8foEiOMMwA4Ydr_SgUWij_WkikTe5TNs8cp7l80KUwUN3o-y9zWyXnHtOZshUw1GasRVvrgi_dDKvltmHseU2G4LnXPK0AQM5xm_UqTQfDLIcvHejVDlQkqvjJ3AG6C8FR8Ycgw88iM-DQygJ9xi6bfUxCDGE"
          />
          
          {/* Animated Nodes overlay */}
          <div className="absolute top-[35%] left-[25%] w-3 h-3 rounded-full bg-[#50ffb0] shadow-[0_0_15px_rgba(80,255,176,0.8)] animate-pulse"></div>
          <div className="absolute top-[45%] left-[55%] w-3 h-3 rounded-full bg-[#50ffb0] shadow-[0_0_15px_rgba(80,255,176,0.8)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-[65%] left-[80%] w-3 h-3 rounded-full bg-[#ff7162] shadow-[0_0_15px_rgba(255,113,98,0.8)] animate-pulse"></div>
          <div className="absolute top-[25%] left-[70%] w-2 h-2 rounded-full bg-[#c5d0ec]"></div>
          
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <path d="M 25% 35% Q 40% 25% 55% 45%" fill="transparent" stroke="rgba(80,255,176,0.3)" strokeDasharray="4 4" strokeWidth="2"></path>
            <path d="M 55% 45% Q 65% 65% 80% 65%" fill="transparent" stroke="rgba(255,113,98,0.3)" strokeDasharray="4 4" strokeWidth="2"></path>
          </svg>
        </div>

        {/* Floating Stat Boxes over Map */}
        <div className="absolute bottom-6 left-6 right-6 grid grid-cols-1 md:grid-cols-3 gap-4 z-10">
          <div className="bg-[#10131a]/90 backdrop-blur p-4 rounded-lg border border-[#45484f]/20 flex items-center gap-4">
             <Server className="text-[#a9abb3]" />
             <div>
               <div className="text-[10px] text-[#a9abb3] uppercase tracking-wider">Total Active Nodes</div>
               <div className="text-xl font-bold font-['Space_Grotesk'] text-[#ecedf6]">1,204</div>
             </div>
          </div>
          <div className="bg-[#10131a]/90 backdrop-blur p-4 rounded-lg border border-[#45484f]/20 flex items-center gap-4">
             <Activity className="text-[#50ffb0]" />
             <div>
               <div className="text-[10px] text-[#a9abb3] uppercase tracking-wider">Uptime</div>
               <div className="text-xl font-bold font-['Space_Grotesk'] text-[#50ffb0]">99.98%</div>
             </div>
          </div>
          <div className="bg-[#10131a]/90 backdrop-blur p-4 rounded-lg border border-[#45484f]/20 flex items-center gap-4">
             <Zap className="text-[#17df93]" />
             <div>
               <div className="text-[10px] text-[#a9abb3] uppercase tracking-wider">TPS (Verifications)</div>
               <div className="text-xl font-bold font-['Space_Grotesk'] text-[#ecedf6]">45.2k</div>
             </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default NodeStatus;
