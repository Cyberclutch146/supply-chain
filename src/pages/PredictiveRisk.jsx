import React from 'react';
import { AlertTriangle, AlertCircle, TrendingUp, Info } from 'lucide-react';

const PredictiveRisk = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#ecedf6] flex items-center gap-3">
            <AlertTriangle className="text-[#ff7162]" size={32} />
            Predictive Risk Models
          </h1>
          <p className="text-[#a9abb3] text-sm mt-2">
            Real-time neural forecasting for supply chain disruptions based on global datasets.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-[#1c2028] text-[#ecedf6] px-4 py-2 rounded-lg border border-[#45484f]/20 hover:bg-[#22262f] transition-colors font-medium text-sm flex items-center gap-2">
            <TrendingUp size={16} />
            Recalculate AI Model
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1c2028]/80 backdrop-blur rounded-xl p-6 border border-[#ff7162]/20 shadow-[0_0_20px_rgba(255,113,98,0.05)]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#a9abb3] text-sm font-medium">Critical Alerts (48h)</span>
            <AlertCircle className="text-[#ff7162]" size={20} />
          </div>
          <div className="font-['Space_Grotesk'] text-3xl font-bold text-[#ff7162]">3</div>
          <p className="text-[#a9abb3] text-xs mt-2">Requires immediate attention</p>
        </div>
        <div className="bg-[#1c2028]/80 backdrop-blur rounded-xl p-6 border border-[#45484f]/20">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#a9abb3] text-sm font-medium">Average Fleet Delay Risk</span>
            <TrendingUp className="text-[#17df93]" size={20} />
          </div>
          <div className="font-['Space_Grotesk'] text-3xl font-bold text-[#ecedf6]">12.4%</div>
          <p className="text-[#17df93] text-xs mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> -2.1% improvement from yesterday
          </p>
        </div>
        <div className="bg-[#1c2028]/80 backdrop-blur rounded-xl p-6 border border-[#45484f]/20">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#a9abb3] text-sm font-medium">Data Confidence Score</span>
            <Info className="text-[#50ffb0]" size={20} />
          </div>
          <div className="font-['Space_Grotesk'] text-3xl font-bold text-[#50ffb0]">94.8%</div>
          <p className="text-[#a9abb3] text-xs mt-2">Based on active sensor coverage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Identified Risks */}
        <div className="bg-[#10131a] rounded-xl p-6 border border-[#45484f]/15">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#ecedf6] mb-6">Active Disruption Warnings</h3>
          <div className="space-y-4">
            
            <div className="bg-[#1c2028] p-4 rounded-lg flex items-start gap-4 border border-[#ff7162]/20 hover:bg-[#22262f] transition-colors">
              <div className="bg-[#ff7162]/10 p-2 rounded-lg">
                 <AlertCircle className="text-[#ff7162]" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-sm font-bold text-[#ecedf6]">Vessel Transit Delay</div>
                  <span className="bg-[#ff7162]/10 text-[#ff7162] text-[10px] font-bold px-2 py-0.5 rounded">87% Prob</span>
                </div>
                <div className="text-xs text-[#a9abb3] font-mono mt-1">Node: SGP-Rotterdam</div>
                <p className="text-xs text-[#ecedf6]/60 mt-2">Weather anomalies detected in the Malacca Strait affecting shipping lanes. Recommended reroute.</p>
              </div>
            </div>

            <div className="bg-[#1c2028] p-4 rounded-lg flex items-start gap-4 border border-[#3c475d]/20 hover:bg-[#22262f] transition-colors">
              <div className="bg-[#3c475d]/20 p-2 rounded-lg">
                 <AlertTriangle className="text-[#c5d0ec]" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-sm font-bold text-[#ecedf6]">Customs Clearance Anomaly</div>
                  <span className="bg-[#3c475d]/40 text-[#c5d0ec] text-[10px] font-bold px-2 py-0.5 rounded">42% Prob</span>
                </div>
                <div className="text-xs text-[#a9abb3] font-mono mt-1">Node: LAX-Entry</div>
                <p className="text-xs text-[#ecedf6]/60 mt-2">Historical dock striking patterns show heightened probability over the next 72 hours.</p>
              </div>
            </div>

          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-[#1c2028]/80 backdrop-blur rounded-xl p-6 border border-[#50ffb0]/20 shadow-[inset_0_0_0_1px_rgba(80,255,176,0.1),0_0_30px_rgba(80,255,176,0.05)] flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#50ffb0]/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-4">
            <span className="material-symbols-outlined text-5xl text-[#50ffb0] animate-pulse">psychology</span>
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#ecedf6]">Network is Stable</h3>
            <p className="text-[#a9abb3] text-sm max-w-sm mx-auto leading-relaxed">
              ChainSight Neural Engine indicates no systemic threats to ledger tracking integrity. All existing anomalies are contained within expected operational margins.
            </p>
            <button className="px-6 py-2 mt-4 bg-[#50ffb0]/10 text-[#50ffb0] border border-[#50ffb0]/20 rounded-lg text-sm font-bold tracking-wide hover:bg-[#50ffb0]/20 transition-colors">
              View Detailed Heatmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveRisk;
