import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { toast } from 'react-hot-toast';
import { BrowserProvider } from 'ethers';

const Landing = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signInAnonymously(auth);
      
      // Set a generic identity for session login
      await setDoc(doc(db, 'users', user.uid), {
        walletAddress: '0xDEVICE0000000000000000000000000000NODE',
        nodeId: 'Node-DEV',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Authentication Failed');
    }
  };

  const handleWalletSelect = async () => {
    try {
      if (!window.ethereum) {
        toast.error('MetaMask or Web3 wallet not detected.');
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      // Request a signature to prove ownership
      const signer = await provider.getSigner();
      const message = `Sign this message to authenticate with Sovereign Ledger.\nNonce: ${Date.now()}`;
      await signer.signMessage(message);

      // Authenticate via Firebase
      const { user } = await signInAnonymously(auth);
      
      await setDoc(doc(db, 'users', user.uid), {
        walletAddress: address,
        nodeId: `Node-${address.substring(2,6).toUpperCase()}`,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      navigate('/');
    } catch (error) {
      console.error('Wallet connect failed', error);
      toast.error(error.message || 'Signature rejected or wallet failed.');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary">
      {/* TopNavBar Component */}
      <header className="bg-[#0b0e14]/80 backdrop-blur-xl fixed top-0 w-full z-50 shadow-[0_4px_30px_rgba(80,255,176,0.08)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 w-full gap-x-6">
          <div className="flex items-center gap-x-12">
            <div className="text-2xl font-bold tracking-tighter text-[#ecedf6] font-['Space_Grotesk']">ChainSight</div>
            <nav className="hidden md:flex items-center gap-x-8 font-['Space_Grotesk'] tracking-tight">
              <span onClick={() => setShowLoginModal(true)} className="text-[#50ffb0] border-b-2 border-[#50ffb0] pb-1 cursor-pointer">Fleet</span>
              <span onClick={() => setShowLoginModal(true)} className="text-[#ecedf6]/60 hover:text-[#50ffb0] transition-colors duration-300 cursor-pointer">Logistics</span>
              <span onClick={() => setShowLoginModal(true)} className="text-[#ecedf6]/60 hover:text-[#50ffb0] transition-colors duration-300 cursor-pointer">Intelligence</span>
              <span onClick={() => setShowLoginModal(true)} className="text-[#ecedf6]/60 hover:text-[#50ffb0] transition-colors duration-300 cursor-pointer">Contracts</span>
            </nav>
          </div>
          <div className="flex items-center gap-x-4">
            <button onClick={() => setShowLoginModal(true)} className="text-[#ecedf6]/60 hover:text-[#50ffb0] transition-colors duration-300 font-['Space_Grotesk'] tracking-tight px-4 py-2">
              Login
            </button>
            <button onClick={() => setShowWalletModal(true)} className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-medium px-6 py-2 rounded-xl transition-transform hover:scale-105 active:scale-95 font-['Space_Grotesk'] tracking-tight">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center justify-center px-8 overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-[150px]"></div>
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/15 text-primary text-sm font-medium font-body shadow-[0_0_20px_rgba(80,255,176,0.1)]">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Mainnet v2.4 Live
              </div>
              <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-tight tracking-tighter">
                The Sovereign Ledger for <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container">Global Logistics</span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-xl font-body leading-relaxed">
                Cryptographic proof-of-provenance meets enterprise AI. Secure your supply chain with verifiable nodes, zero-knowledge proofs, and real-time neural intelligence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => setShowWalletModal(true)} className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-semibold px-8 py-4 rounded-xl transition-transform hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(80,255,176,0.2)]">
                  Deploy Infrastructure
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                </button>
                <button className="px-8 py-4 rounded-xl border border-outline-variant/20 hover:border-primary/40 text-on-surface font-headline font-medium transition-all bg-surface-container-low hover:bg-surface-container flex items-center justify-center gap-2 relative overflow-hidden group">
                  <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  View Documentation
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-12 border-t border-outline-variant/10">
                <div>
                  <div className="text-3xl font-headline font-bold text-on-surface">$4.2B</div>
                  <div className="text-sm text-on-surface-variant font-body mt-1">Total Value Tracked</div>
                </div>
                <div>
                  <div className="text-3xl font-headline font-bold text-on-surface">18.4k</div>
                  <div className="text-sm text-on-surface-variant font-body mt-1">Active Nodes</div>
                </div>
                <div>
                  <div className="text-3xl font-headline font-bold text-primary">0.01s</div>
                  <div className="text-sm text-on-surface-variant font-body mt-1">Proof Finality</div>
                </div>
              </div>
            </div>

            {/* Hero Visual / Bento Base */}
            <div className="relative h-[600px] w-full perspective-1000">
              <div className="absolute inset-0 bg-surface-container-high/80 backdrop-blur-xl rounded-2xl border border-outline-variant/15 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:rotate-y-0 hover:rotate-x-0 group">
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(80,255,176,0)] group-hover:shadow-[inset_0_0_0_1px_rgba(80,255,176,0.3)] transition-all duration-500 pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/15">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                    <span className="font-headline font-semibold text-lg">Neural Provenance Graph</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-on-surface-variant font-mono">Syncing</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                    </div>
                  </div>
                </div>

                {/* Mock Terminal/Graph Content */}
                <div className="space-y-4 font-mono text-sm">
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10 flex justify-between items-center group/item hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                      <span className="text-on-surface-variant text-xs">Block #894210</span>
                    </div>
                    <span className="text-primary text-xs opacity-80">Verified</span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10 flex justify-between items-center group/item hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                      <span className="text-on-surface-variant text-xs">Block #894209</span>
                    </div>
                    <span className="text-primary text-xs opacity-80">Verified</span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-tertiary/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-tertiary/5"></div>
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-tertiary text-base">warning</span>
                        <span className="text-on-surface-variant text-xs">Anomaly Detected: Node Alpha</span>
                      </div>
                      <span className="text-tertiary text-xs">Resolving...</span>
                    </div>
                  </div>

                  {/* Graphical representation */}
                  <div className="h-40 mt-6 relative w-full flex items-end gap-2 pt-4 border-b border-l border-outline-variant/20 px-2 pb-2">
                    <div className="w-1/6 bg-secondary-container h-[40%] rounded-t-sm hover:bg-primary/40 transition-colors"></div>
                    <div className="w-1/6 bg-secondary-container h-[60%] rounded-t-sm hover:bg-primary/40 transition-colors"></div>
                    <div className="w-1/6 bg-primary-container h-[85%] rounded-t-sm relative shadow-[0_0_15px_rgba(80,255,176,0.3)]">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-primary font-bold">Peak</div>
                    </div>
                    <div className="w-1/6 bg-secondary-container h-[50%] rounded-t-sm hover:bg-primary/40 transition-colors"></div>
                    <div className="w-1/6 bg-secondary-container h-[70%] rounded-t-sm hover:bg-primary/40 transition-colors"></div>
                    <div className="w-1/6 bg-primary/20 h-[30%] rounded-t-sm border-t border-primary border-dashed animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Decorative floating element */}
              <div className="absolute -bottom-8 -right-8 bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/20 p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center gap-4 animate-[bounce_4s_infinite_ease-in-out]">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                  <span className="material-symbols-outlined text-primary text-xl">security</span>
                </div>
                <div>
                  <div className="text-xs text-on-surface-variant font-mono">Consensus</div>
                  <div className="text-sm font-bold text-on-surface">100% Secured</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid Section */}
        <section className="bg-surface-container-low py-24 relative">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Architectural Integrity</h2>
              <p className="text-on-surface-variant max-w-2xl text-lg">Beyond mere tracking. A cryptographic foundation designed for zero-trust environments where data provenance is mission-critical.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
              
              {/* Feature 1 */}
              <div className="md:col-span-2 bg-surface-container-high/60 backdrop-blur-lg rounded-2xl p-8 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/20 transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-500"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <span className="material-symbols-outlined text-primary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>enhanced_encryption</span>
                  <div>
                    <h3 className="text-2xl font-headline font-bold mb-2">Zero-Knowledge Proofs</h3>
                    <p className="text-on-surface-variant">Verify logistical milestones without exposing sensitive route or cargo data. Mathematical certainty meets enterprise privacy.</p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 relative overflow-hidden group hover:border-outline-variant/30 transition-colors">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-full flex flex-col items-center text-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-secondary-container/30 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-on-secondary-container text-3xl">route</span>
                  </div>
                  <h3 className="text-lg font-headline font-semibold">Immutable Routing</h3>
                  <p className="text-sm text-on-surface-variant">Historical pathing recorded permanently on-chain.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 flex items-center gap-6 group hover:border-outline-variant/30 transition-colors">
                <div className="w-14 h-14 rounded-full bg-tertiary-container/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-tertiary text-2xl">memory</span>
                </div>
                <div>
                  <h3 className="text-lg font-headline font-semibold mb-1">Explainable AI</h3>
                  <p className="text-sm text-on-surface-variant">Predictive models with auditable decision trees.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-2 bg-surface-container-high/80 rounded-2xl p-8 border border-outline-variant/10 group shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_30px_rgba(80,255,176,0.05)] transition-shadow duration-500">
                <div className="flex flex-col md:flex-row h-full gap-8 items-center">
                  <div className="flex-1">
                    <h3 className="text-2xl font-headline font-bold mb-3 flex items-center gap-2">
                      Smart Contract Audits
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-primary/10 text-primary border border-primary/20">Automated</span>
                    </h3>
                    <p className="text-on-surface-variant mb-6">Continuous static analysis and formal verification of logistical smart contracts deployed to the network.</p>
                    <button className="text-primary text-sm font-medium hover:text-primary-container transition-colors flex items-center gap-1">
                      View Audit Logs <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                    </button>
                  </div>
                  <div className="w-full md:w-1/2 bg-surface p-4 rounded-xl border border-outline-variant/15 font-mono text-xs text-on-surface-variant space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                      <span className="material-symbols-outlined text-primary">policy</span>
                    </div>
                    <div className="flex justify-between"><span className="text-secondary-dim">Contract:</span> <span>0x7f4...9a2</span></div>
                    <div className="flex justify-between"><span className="text-secondary-dim">Status:</span> <span className="text-primary">Secured</span></div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-3">
                      <div className="bg-gradient-to-r from-primary to-primary-container h-full w-[100%] rounded-full shadow-[0_0_10px_rgba(80,255,176,0.5)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0e14] w-full py-12 px-8 border-t border-[#45484f]/15 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-y-6">
          <div className="text-lg font-black text-[#ecedf6] font-['Space_Grotesk'] tracking-tighter">ChainSight</div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <span className="text-[#ecedf6]/40 hover:text-[#50ffb0] transition-opacity font-['Inter'] text-xs uppercase tracking-widest cursor-pointer">Privacy Protocol</span>
            <span className="text-[#ecedf6]/40 hover:text-[#50ffb0] transition-opacity font-['Inter'] text-xs uppercase tracking-widest cursor-pointer">Terms of Service</span>
            <span className="text-[#ecedf6]/40 hover:text-[#50ffb0] transition-opacity font-['Inter'] text-xs uppercase tracking-widest cursor-pointer">API Documentation</span>
            <span className="text-[#ecedf6]/40 hover:text-[#50ffb0] transition-opacity font-['Inter'] text-xs uppercase tracking-widest cursor-pointer">Network Status</span>
          </nav>
          <div className="text-[#ecedf6]/40 font-['Inter'] text-xs uppercase tracking-widest text-center md:text-right">
            © 2024 ChainSight Intelligence. Secured by Sovereign Ledger.
          </div>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-container-low/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 z-0 bg-transparent pointer-events-none" onClick={() => setShowLoginModal(false)}></div>
          
          <main className="relative z-10 w-full max-w-[420px]">
            <div className="bg-surface-container-high/80 backdrop-blur-xl border border-outline-variant/15 rounded-xl shadow-[0_0_40px_rgba(80,255,176,0.06)] p-8 md:p-10 flex flex-col gap-8 relative overflow-hidden group">
              {/* Close Button */}
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/20 transition-colors duration-700 pointer-events-none shadow-[inset_0_0_20px_rgba(80,255,176,0)] group-hover:shadow-[inset_0_0_20px_rgba(80,255,176,0.05)]"></div>
              
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center mb-1 shadow-[0_0_20px_rgba(80,255,176,0.05)] relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-primary font-mono text-[8px] overflow-hidden leading-none break-all p-1">
                    0x7A2F...9C1B 0x3E8D...4F2A
                  </div>
                  <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                </div>
                <h1 className="font-headline text-3xl font-bold tracking-tighter text-on-background">ChainSight</h1>
                <p className="text-on-surface-variant font-label text-sm tracking-wide">Enterprise Node Authentication</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold tracking-widest text-on-surface-variant" htmlFor="node-id">Operator ID / Node Email</label>
                  <div className="relative flex items-center group/input">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/60 text-lg group-focus-within/input:text-primary transition-colors">person</span>
                    <input className="w-full bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface text-sm rounded-lg pl-10 pr-4 py-3 transition-all outline-none placeholder:text-on-surface-variant/40 focus:shadow-[0_0_12px_rgba(80,255,176,0.15)]" id="node-id" placeholder="Enter credential sequence" type="text" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold tracking-widest text-on-surface-variant" htmlFor="auth-key">Cryptographic Key</label>
                    <span className="text-[11px] font-medium text-primary hover:text-primary-dim transition-colors tracking-wide cursor-pointer">Recover Access</span>
                  </div>
                  <div className="relative flex items-center group/input">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/60 text-lg group-focus-within/input:text-primary transition-colors">key</span>
                    <input className="w-full bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface text-sm rounded-lg pl-10 pr-10 py-3 transition-all outline-none placeholder:text-on-surface-variant/40 focus:shadow-[0_0_12px_rgba(80,255,176,0.15)] font-mono tracking-widest" id="auth-key" placeholder="••••••••••••" type="password" />
                  </div>
                </div>

                <button type="submit" className="mt-2 w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-bold text-[15px] tracking-wide py-3.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(80,255,176,0.15)] active:scale-[0.98]">
                  <span>Initialize Session</span>
                  <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
                </button>
              </form>

              <div className="mt-2 pt-6 border-t border-outline-variant/15 flex flex-col items-center justify-center gap-3 relative z-10">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  <span className="text-primary text-[10px] font-semibold tracking-wider uppercase">Secured by Sovereign Ledger</span>
                </div>
                <p className="text-[10px] text-on-surface-variant/50 font-mono text-center">
                  Session ID: <span className="text-on-surface-variant/80">0x8F...E2A1</span>
                </p>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Wallet Modal Overlay */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-container-low/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" style={{
            backgroundImage: "linear-gradient(to right, rgba(69, 72, 79, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(69, 72, 79, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
        }}>
          <div className="absolute inset-0 z-0 bg-transparent pointer-events-none" onClick={() => setShowWalletModal(false)}></div>
          
          <main className="relative z-10 w-full max-w-lg">
            <div className="bg-surface-container-high/80 backdrop-blur-xl rounded-xl border border-outline-variant/15 overflow-hidden flex flex-col relative" style={{boxShadow: "inset 0 0 0 1px rgba(80, 255, 176, 0.2), 0 0 20px rgba(80, 255, 176, 0.05)"}}>
              <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Space Grotesk\" font-size=\"20\" fill=\"%2350ffb0\" opacity=\"0.05\">SECURE</text></svg>')",
                  opacity: 0.5
              }}></div>
              
              <div className="px-8 pt-8 pb-6 flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center mb-6 relative">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
                </div>
                <h1 className="font-headline text-[2rem] font-bold tracking-tight mb-2 text-on-surface">Connect Wallet</h1>
                <p className="font-body text-[0.875rem] text-on-surface-variant max-w-xs">
                  Establish a secure connection to the Sovereign Ledger. Cryptographic verification required.
                </p>
              </div>

              <div className="bg-surface-container-low px-8 py-6 relative z-10 space-y-4">
                <div className="bg-surface-container-lowest rounded-lg p-3 flex items-center gap-3 border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary-dim text-sm">lock</span>
                  <span className="font-body text-[0.75rem] text-on-surface-variant font-medium">End-to-end encrypted connection verified</span>
                </div>

                <div className="space-y-3">
                  <button onClick={handleWalletSelect} className="w-full bg-surface-container-highest/80 border border-outline-variant/15 rounded-lg p-4 flex items-center justify-between group transition-all duration-300 hover:bg-[#1c2028]/95 hover:shadow-[inset_0_0_0_1px_rgba(80,255,176,1),0_0_40px_rgba(80,255,176,0.08)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center border border-outline-variant/20">
                        <img alt="MetaMask Logo" className="w-6 h-6 object-contain rounded-full opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvvRgpo_W2Fn0t2VnqOMffEfSNfGPpn3Z0kSqaMXzGdXiT_lg7p-tEU7enWWEWS9tFsjZpS78_CozAtZVTKnH-Mcbll-Jj4TlHnV6QSzZN7dnYjHYV9vHNZqdHDg9lnFpz-ArbymenLHGI2G_nrYQk8_LNx8RRxwLJhASDBVMlXv4xS2hOglpm2j2qp1hZXozQw87fAh60QBJYYkUKwdhgCF8U26FZYpUZ4f0Y3I3pWIpTT3MW2oUsFzwfLocpfZSI7MQMXwyYn8Q" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-body text-[1rem] font-semibold text-on-surface group-hover:text-primary transition-colors">MetaMask</h3>
                        <p className="font-body text-[0.75rem] text-on-surface-variant">Browser Extension</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform duration-300">chevron_right</span>
                  </button>

                  <button onClick={handleWalletSelect} className="w-full bg-surface-container-highest/80 border border-outline-variant/15 rounded-lg p-4 flex items-center justify-between group transition-all duration-300 hover:bg-[#1c2028]/95 hover:shadow-[inset_0_0_0_1px_rgba(80,255,176,1),0_0_40px_rgba(80,255,176,0.08)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center border border-outline-variant/20">
                        <span className="material-symbols-outlined text-secondary-dim text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-body text-[1rem] font-semibold text-on-surface group-hover:text-primary transition-colors">WalletConnect</h3>
                        <p className="font-body text-[0.75rem] text-on-surface-variant">Mobile Wallets</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform duration-300">chevron_right</span>
                  </button>

                  <button onClick={handleWalletSelect} className="w-full bg-surface-container-highest/80 border border-outline-variant/15 rounded-lg p-4 flex items-center justify-between group transition-all duration-300 relative overflow-hidden hover:bg-[#1c2028]/95 hover:shadow-[inset_0_0_0_1px_rgba(80,255,176,1),0_0_40px_rgba(80,255,176,0.08)]">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-primary-container opacity-50 group-hover:opacity-100"></div>
                    <div className="flex items-center gap-4 pl-2">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center border border-outline-variant/20">
                        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>assured_workload</span>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="font-body text-[1rem] font-semibold text-on-surface group-hover:text-primary transition-colors">Enterprise Ledger</h3>
                          <span className="bg-primary/10 text-primary text-[0.65rem] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Recommended</span>
                        </div>
                        <p className="font-body text-[0.75rem] text-on-surface-variant">Hardware &amp; Institutional</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform duration-300">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="bg-surface-container-lowest px-8 py-5 border-t border-outline-variant/15 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <p className="font-body text-[0.75rem] text-on-surface-variant text-center sm:text-left">
                  New to Web3? <span className="text-primary hover:text-primary-container transition-colors font-medium cursor-pointer">Read our setup guide</span>
                </p>
                <button onClick={() => setShowWalletModal(false)} className="font-body text-[0.875rem] text-on-surface-variant hover:text-on-surface transition-colors">Cancel</button>
              </div>
            </div>

            <div className="mt-6 flex justify-center items-center gap-2 text-[0.75rem] font-body text-on-surface-variant">
              <span className="material-symbols-outlined text-[1rem]">help</span>
              <span>Having trouble connecting? Contact <span className="text-primary hover:underline cursor-pointer">Support</span></span>
            </div>
          </main>
        </div>
      )}

    </div>
  );
};

export default Landing;
