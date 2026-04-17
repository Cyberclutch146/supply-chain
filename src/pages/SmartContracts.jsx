import React from 'react';
import { FileSignature, CheckCircle, Shield, History } from 'lucide-react';

const SmartContracts = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#ecedf6] flex items-center gap-3">
            <FileSignature className="text-[#50ffb0]" size={32} />
            Smart Contracts & Escrow
          </h1>
          <p className="text-[#a9abb3] text-sm mt-2">
            Immutable agreements executed autonomously based on verified supply chain milestones.
          </p>
        </div>
        <button className="bg-gradient-to-r from-[#50ffb0] to-[#17df93] text-[#00482c] px-6 py-2 rounded-lg font-bold text-sm shadow-[0_0_20px_rgba(80,255,176,0.2)] hover:scale-[1.02] transition-transform">
          Deploy New Contract
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Deployed Contracts Stack */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1c2028] p-6 rounded-xl border border-[#45484f]/20">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#ecedf6] mb-4">Active Agreements</h3>
            
            <div className="space-y-3">
              {[
                { name: "Global Lithium Logistics Agreement", hash: "0x8fB...92C", value: "$1.2M", status: "Active", progress: 60 },
                { name: "Medical Supply Chain SLA", hash: "0x3Aa...14E", value: "$400K", status: "Executed", progress: 100 },
                { name: "Semiconductor Transport Escrow", hash: "0x91C...FF2", value: "$8.5M", status: "Pending Conditions", progress: 20 },
              ].map((contract, i) => (
                <div key={i} className="bg-[#10131a] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#45484f]/10 cursor-pointer hover:border-[#50ffb0]/30 transition-colors group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[#50ffb0] bg-[#50ffb0]/10 px-2 py-0.5 rounded">{contract.hash}</span>
                      <span className={`text-[10px] font-bold uppercase ${contract.status === 'Executed' ? 'text-gray-500' : 'text-[#c5d0ec]'}`}>
                        {contract.status}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-[#ecedf6] group-hover:text-[#50ffb0] transition-colors">{contract.name}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-[#a9abb3]">Escrow Value</div>
                      <div className="text-sm font-mono text-[#ecedf6]">{contract.value}</div>
                    </div>
                    <div className="w-24 text-right">
                      <div className="text-xs text-[#a9abb3] mb-1">{contract.progress}% Verifed</div>
                      <div className="w-full h-1.5 bg-[#22262f] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#50ffb0] to-[#17df93]" 
                          style={{ width: `${contract.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - System Info */}
        <div className="space-y-6">
          <div className="bg-[#10131a] p-6 rounded-xl border border-[#45484f]/20">
            <Shield className="text-[#50ffb0] mb-4" size={28} />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#ecedf6] mb-2">Cryptographic Proofs</h3>
            <p className="text-[#a9abb3] text-xs leading-relaxed mb-6">
              All active smart contracts are verified using Zero-Knowledge proofs. Your node constantly validates incoming GPS checks to authorize Escrow release.
            </p>
            <div className="space-y-2 font-mono text-[11px] text-[#a9abb3]">
              <div className="flex justify-between border-b border-[#45484f]/20 pb-2">
                <span>Active Network</span>
                <span className="text-[#ecedf6]">Polygon Amoy</span>
              </div>
              <div className="flex justify-between border-b border-[#45484f]/20 pb-2">
                <span>Total Value Locked</span>
                <span className="text-[#50ffb0]">$10.1M USD</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Gas Offset</span>
                <span className="text-[#ecedf6]">Sponsored</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1c2028] p-6 rounded-xl border border-[#45484f]/20">
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#ecedf6] mb-4 flex items-center gap-2">
              <History size={16} /> Recent Ledger Events
            </h3>
            <div className="space-y-4">
               <div className="flex gap-3 items-start">
                  <CheckCircle className="text-[#50ffb0] flex-shrink-0" size={14} />
                  <div>
                    <div className="text-xs text-[#ecedf6]">Escrow Payload Released</div>
                    <div className="text-[10px] text-[#a9abb3] mt-0.5">Tx: 0x98A...12D • 5 mins ago</div>
                  </div>
               </div>
               <div className="flex gap-3 items-start">
                  <CheckCircle className="text-[#50ffb0] flex-shrink-0" size={14} />
                  <div>
                    <div className="text-xs text-[#ecedf6]">Contract Provisioned</div>
                    <div className="text-[10px] text-[#a9abb3] mt-0.5">Tx: 0x11B...EFC • 1 hr ago</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SmartContracts;
