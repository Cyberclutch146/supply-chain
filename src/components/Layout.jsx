import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Globe, AlertTriangle, FileSignature, Network, Settings, Plus, LayoutDashboard } from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="dark antialiased min-h-screen flex flex-col md:flex-row bg-[#0b0e14] w-full text-on-surface">
      {/* Mobile Top Bar */}
      <header className="md:hidden w-full top-0 sticky z-40 bg-[#10131a] shadow-[0_0_20px_rgba(80,255,176,0.05)] border-b border-outline-variant/10 flex items-center justify-between px-6 py-4 transition-colors">
        <button className="text-[#50ffb0] hover:text-[#primary] focus:outline-none" onClick={() => navigate('/')}>
          <LayoutDashboard size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-['Space_Grotesk'] tracking-tight text-[10px] text-on-surface-variant uppercase">Sovereign Ledger</span>
          <h1 className="text-xl font-bold text-[#50ffb0] tracking-tighter font-['Space_Grotesk']">ChainSight</h1>
        </div>
        {isHome ? (
          <button onClick={() => navigate('/add-shipment')} className="text-[#00482c] pulse-btn p-1.5 rounded-full shadow-neon">
            <Plus size={20} />
          </button>
        ) : (
          <div className="w-6 h-6" />
        )}
      </header>

      {/* Desktop Navigation Drawer */}
      <nav className="hidden md:flex flex-col py-8 px-4 gap-y-2 h-screen w-72 bg-[#10131a] fixed left-0 top-0 bottom-0 z-40 border-r border-outline-variant/10">
        <div className="mb-10 px-4">
          <h2 className="text-[#50ffb0] font-black italic text-2xl tracking-tighter mb-1 font-['Space_Grotesk'] cursor-pointer" onClick={() => navigate('/')}>ChainSight</h2>
          <p className="font-['Space_Grotesk'] text-sm text-on-surface-variant font-medium tracking-widest uppercase mb-6">THE SOVEREIGN LEDGER</p>
          
          <div className="mb-6 p-3 rounded-lg bg-surface-container-low border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#50ffb0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#50ffb0]"></span>
              </span>
              <span className="text-xs font-mono text-[#50ffb0]">Connected</span>
            </div>
            <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">Network: Polygon Amoy</p>
            <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mt-1">Block: #1234567</p>
          </div>

          {isHome && (
             <button onClick={() => navigate('/add-shipment')} className="pulse-btn w-full py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-neon">
               <Plus size={18} /> New Shipment
             </button>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-y-2 font-['Space_Grotesk'] text-sm">
          <Link to="/" className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group cursor-pointer ${isHome ? 'text-[#50ffb0] bg-[#50ffb0]/10 border-r-2 border-[#50ffb0]' : 'text-[#ecedf6]/70 hover:bg-[#1c2028] hover:text-[#ecedf6]'}`}>
            <Globe size={20} />
            <span className="font-semibold">Global Overview</span>
          </Link>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#ecedf6]/70 hover:bg-[#1c2028] hover:text-[#ecedf6] transition-all duration-300 group cursor-pointer">
            <AlertTriangle size={20} />
            <span className="font-medium">Predictive Risk</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#ecedf6]/70 hover:bg-[#1c2028] hover:text-[#ecedf6] transition-all duration-300 group cursor-pointer">
            <FileSignature size={20} />
            <span className="font-medium">Smart Contracts</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#ecedf6]/70 hover:bg-[#1c2028] hover:text-[#ecedf6] transition-all duration-300 group cursor-pointer">
            <Network size={20} />
            <span className="font-medium">Node Status</span>
          </a>
        </div>
        <div className="mt-auto pt-8 font-['Space_Grotesk'] text-sm">
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#ecedf6]/70 hover:bg-[#1c2028] hover:text-[#ecedf6] transition-all duration-300 group cursor-pointer">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </a>
          <div className="mt-6 px-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-primary/20 bg-primary/20 flex items-center justify-center text-primary font-bold">
               A
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Admin.0x8F</p>
              <p className="text-xs font-mono crypto-mono text-[#50ffb0]">Conn: Secure</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen pb-24 md:pb-8 w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 border-t border-[#45484f]/15 bg-[#0b0e14]/80 backdrop-blur-xl shadow-[0_-10px_40px_rgba(80,255,176,0.08)] flex justify-around items-center h-20 px-4 pb-safe font-['Inter'] text-[10px] uppercase font-bold tracking-widest">
        <Link to="/" className={`flex flex-col items-center justify-center rounded-lg px-4 py-1 transition-all active:scale-95 duration-200 ${isHome ? 'text-[#50ffb0] bg-[#1c2028]' : 'text-[#ecedf6]/60 hover:bg-[#161a21]'}`}>
          <LayoutDashboard size={24} className="mb-1" />
          <span>Fleet</span>
        </Link>
        <button className="flex flex-col items-center justify-center text-[#ecedf6]/60 hover:bg-[#161a21] transition-all active:scale-95 duration-200 py-2 px-3 rounded-lg">
          <AlertTriangle size={24} className="mb-1" />
          <span>Intelligence</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#ecedf6]/60 hover:bg-[#161a21] transition-all active:scale-95 duration-200 py-2 px-3 rounded-lg">
          <Network size={24} className="mb-1" />
          <span>Ledger</span>
        </button>
      </nav>
    </div>
  );
};
export default Layout;
