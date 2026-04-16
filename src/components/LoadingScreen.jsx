import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-[#50ffb0] selection:bg-[#50ffb0]/20 font-inter">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-24 h-24 border-2 border-[#50ffb0]/20 rounded-full animate-ping"></div>
        <div className="absolute w-16 h-16 border-2 border-[#50ffb0]/40 rounded-full animate-pulse"></div>
        <Loader2 className="w-12 h-12 animate-spin text-[#50ffb0]" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight mb-2 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
        ChainSight Network Initializing
      </h1>
      <p className="text-gray-400 text-sm tracking-wide opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
        Syncing distributed ledger...
      </p>
    </div>
  );
};

export default LoadingScreen;
