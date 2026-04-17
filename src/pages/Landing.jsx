import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInAnonymously } from 'firebase/auth';
import toast from 'react-hot-toast';

const Landing = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await signInAnonymously(auth);
      toast.success("Wallet connection verified.");
      // Navigation is handled automatically by App.jsx Route observer.
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect ledger.");
      setIsConnecting(false);
      setShowWalletModal(false);
    }
  };

  return (
    <div className="bg-[#0b0e14] text-[#ecedf6] selection:bg-[#17df93] selection:text-[#00482c] min-h-screen relative overflow-x-hidden" style={{
      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(80, 255, 176, 0.05) 1px, transparent 0)',
      backgroundSize: '40px 40px'
    }}>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-40 bg-[#0b0e14]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(80,255,176,0.08)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#50ffb0] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            <span className="text-xl font-bold tracking-tighter text-[#ecedf6] font-['Space_Grotesk']">ChainSight</span>
          </div>
          <button 
            onClick={() => setShowWalletModal(true)}
            className="bg-gradient-to-br from-[#50ffb0] to-[#17df93] text-[#00482c] font-['Space_Grotesk'] font-bold px-5 py-2 rounded-xl text-sm transition-transform active:scale-95"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-2xl mx-auto space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#50ffb0]/20 bg-[#50ffb0]/5 text-[#50ffb0] text-[10px] font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            Protocol v2.4 Active
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-[#ecedf6] font-['Space_Grotesk'] leading-[1.1]">
            The <span className="text-[#50ffb0]">Sovereign Ledger</span> for Global Logistics
          </h1>
          <p className="text-[#a9abb3] text-lg font-light leading-relaxed">
            Autonomous supply chain intelligence powered by neural nodes and immutable provenance. Predicting disruptions before they ripple through your network.
          </p>
          <div className="pt-4">
            <button 
              onClick={() => setShowWalletModal(true)}
              className="w-full py-4 bg-gradient-to-r from-[#50ffb0] to-[#17df93] text-[#00482c] font-['Space_Grotesk'] font-black text-lg rounded-xl shadow-[0_0_20px_rgba(80,255,176,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Secure Your Fleet
            </button>
          </div>
        </section>

        {/* Feature 1: Explainable AI */}
        <section className="space-y-6">
          <div className="bg-[#1c2028]/80 backdrop-blur-xl rounded-xl p-8 border border-[#45484f]/15 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(80,255,176,0.08)] transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-[#50ffb0]">psychology</span>
            </div>
            
            <div className="flex flex-col items-center justify-center py-6 mb-6">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-[#22262f]" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-[#50ffb0] drop-shadow-[0_0_8px_rgba(80,255,176,0.6)]" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502.6" strokeDashoffset="110.5" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold font-['Space_Grotesk'] text-[#ecedf6]">78%</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#50ffb0] font-bold">Delay Probability</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-[#ecedf6]">Explainable Neural Nodes</h3>
              <p className="text-[#a9abb3] text-sm leading-relaxed">
                Our AI doesn't just predict; it provides cryptographic proof. Detect route anomalies in real-time with 99.4% accuracy across the global ledger.
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-[#50ffb0] bg-[#50ffb0]/5 p-3 rounded-lg border border-[#50ffb0]/10">
                <span className="material-symbols-outlined text-sm">info</span>
                Anomaly detected: Port Congestion via Node-7
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Provenance Ledger */}
        <section className="space-y-8">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-[#ecedf6]">Provenance Ledger</h3>
              <p className="text-xs text-[#a9abb3] uppercase tracking-widest">Real-time Chain Verification</p>
            </div>
            <span className="material-symbols-outlined text-[#50ffb0]/40">account_tree</span>
          </div>

          <div className="space-y-4">
            <div className="relative pl-8 pb-8 border-l border-[#45484f]/20 ml-2">
              <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#50ffb0] shadow-[0_0_8px_rgba(80,255,176,1)]"></div>
              <div className="bg-[#1c2028]/60 backdrop-blur rounded-xl p-4 border border-[#50ffb0]/10 hover:shadow-[0_0_20px_rgba(80,255,176,0.05)] transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-[#a9abb3]">Tx: 0xA12F...9E2D</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#50ffb0]/10 text-[#50ffb0] text-[9px] font-bold uppercase tracking-tighter border border-[#50ffb0]/20">Block Verified</span>
                </div>
                <p className="text-sm font-medium text-[#ecedf6]">Cargo Dispatched: Singapore Hub</p>
                <div className="mt-2 text-[10px] text-[#a9abb3]/70">Timestamp: 16:42:01 UTC</div>
              </div>
            </div>

            <div className="relative pl-8 pb-8 border-l border-[#45484f]/20 ml-2">
              <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#ff7162] shadow-[0_0_8px_rgba(255,113,98,0.8)]"></div>
              <div className="bg-[#1c2028]/60 backdrop-blur rounded-xl p-4 border border-[#ff7162]/10 hover:shadow-[0_0_20px_rgba(255,113,98,0.05)] transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-[#a9abb3]">Tx: 0x8B32...CC1F</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ff7162]/10 text-[#ff7162] text-[9px] font-bold uppercase tracking-tighter border border-[#ff7162]/20">Flagged</span>
                </div>
                <p className="text-sm font-medium text-[#ecedf6]">Temperature Delta Detected</p>
                <div className="mt-2 text-[10px] text-[#a9abb3]/70">Sensor: RFID-99212 | Critical Threshold</div>
              </div>
            </div>
            
            <div className="relative pl-8 ml-2">
              <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#50ffb0]/30"></div>
              <div className="bg-[#10131a] rounded-xl p-4 border border-[#45484f]/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-[#a9abb3]">Tx: 0x4D01...F29A</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#3c475d]/40 text-[#c5d0ec] text-[9px] font-bold uppercase tracking-tighter">Pending</span>
                </div>
                <p className="text-sm font-medium text-[#a9abb3]">Arrival Confirmation: Rotterdam</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 space-y-8 text-center">
          <div className="relative py-16 px-8 rounded-2xl overflow-hidden bg-[#1c2028] border border-[#45484f]/20">
            <div className="absolute inset-0 bg-gradient-to-b from-[#50ffb0]/5 to-transparent opacity-50"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-[#ecedf6]">Ready to secure your global supply chain?</h2>
              <p className="text-[#a9abb3] text-sm">Join the enterprise standard for cryptographic logistics.</p>
              <button 
                onClick={() => setShowWalletModal(true)}
                className="px-10 py-4 bg-gradient-to-r from-[#50ffb0] to-[#17df93] text-[#00482c] font-['Space_Grotesk'] font-black rounded-xl hover:shadow-[0_0_30px_rgba(80,255,176,0.3)] transition-all active:scale-95"
              >
                Deploy Intelligence
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0e14] border-t border-[#45484f]/15 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-black text-[#50ffb0] font-['Space_Grotesk']">ChainSight</span>
            <p className="font-['Inter'] text-[10px] uppercase tracking-widest text-[#ecedf6]/50 text-center md:text-left">
              © 2024 ChainSight Intelligence. Secured by Sovereign Ledger.
            </p>
          </div>
        </div>
      </footer>

      {/* Wallet Modal (Simulated ConnectWallet Screen) */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-[#0b0e14]/80 backdrop-blur-sm">
          <div className="bg-[#1c2028]/95 backdrop-blur-xl rounded-xl border border-[#45484f]/15 shadow-[inset_0_0_0_1px_rgba(80,255,176,0.2),0_0_20px_rgba(80,255,176,0.05)] overflow-hidden w-full max-w-md animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#000000] border border-[#45484f]/20 flex items-center justify-center mb-6 relative">
                <span className="material-symbols-outlined text-[#50ffb0] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                <div className="absolute inset-0 rounded-full bg-[#50ffb0]/10 animate-pulse"></div>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight mb-2 text-[#ecedf6]">Connect Ledger</h2>
              <p className="text-[13px] text-[#a9abb3] max-w-[250px]">
                Establish a secure connection. Cryptographic verification required.
              </p>
            </div>

            {/* Content */}
            <div className="bg-[#10131a] px-8 py-6 relative z-10 space-y-4">
              <div className="bg-[#000000] rounded-lg p-3 flex items-center gap-3 border border-[#45484f]/10">
                <span className="material-symbols-outlined text-[#3bf0a3] text-sm">lock</span>
                <span className="text-[12px] text-[#a9abb3] font-medium">End-to-end encrypted connection verified</span>
              </div>

              <div className="space-y-3 mt-4">
                {/* Simulated Enterprise Wallet */}
                <button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full bg-[#22262f]/80 border border-[#45484f]/15 rounded-lg p-4 flex items-center justify-between group hover:shadow-[0_0_30px_rgba(80,255,176,0.05)] hover:bg-[#1c2028] hover:border-[#50ffb0]/50 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#50ffb0] to-[#17df93] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-4 pl-2">
                    <div className="w-10 h-10 rounded-lg bg-[#000000] flex items-center justify-center border border-[#45484f]/20">
                      <span className="material-symbols-outlined text-[#50ffb0] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>assured_workload</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[16px] font-semibold text-[#ecedf6] group-hover:text-[#50ffb0] transition-colors">{isConnecting ? 'Verifying...' : 'Enterprise Ledger'}</h3>
                        <span className="bg-[#50ffb0]/10 text-[#50ffb0] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Recommended</span>
                      </div>
                      <p className="text-[12px] text-[#a9abb3]">Hardware & Institutional</p>
                    </div>
                  </div>
                  {isConnecting ? (
                    <span className="material-symbols-outlined animate-spin text-[#50ffb0]">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[#a9abb3] group-hover:text-[#50ffb0] transition-colors">chevron_right</span>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#000000] px-8 py-5 border-t border-[#45484f]/15 flex justify-between items-center relative z-10">
              <p className="text-[12px] text-[#a9abb3]">
                New to Web3? <a className="text-[#50ffb0] hover:text-[#17df93] transition-colors font-medium cursor-pointer">View Guide</a>
              </p>
              <button onClick={() => setShowWalletModal(false)} className="text-[14px] text-[#a9abb3] hover:text-[#ecedf6] transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
