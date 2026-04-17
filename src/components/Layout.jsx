import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { walletAddress } = useAuth();

  const truncatedAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : null;

  const handleLogout = async () => {
    try {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('nodeId');
      await signOut(auth);
      navigate('/landing');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-full pt-20 pb-8 bg-[#161a21] text-[#50ffb0] font-['Inter'] text-sm w-64 fixed left-0 top-0 space-y-6 z-40">
        <div className="px-6 pb-6">
          <h2 className="font-headline text-on-surface font-bold text-lg">Global Logistics</h2>
          {truncatedAddress ? (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_#50ffb0]"></div>
              <p className="text-primary text-xs font-mono font-medium tracking-wide">{truncatedAddress}</p>
            </div>
          ) : (
            <p className="text-on-surface-variant text-xs mt-1">No wallet connected</p>
          )}
        </div>
        <nav className="flex-1 space-y-2">
          <a
            onClick={() => navigate('/')}
            className={`flex items-center gap-3 py-3 px-6 cursor-pointer transition-all ${
              location.pathname === '/' 
                ? 'bg-gradient-to-r from-[#50ffb0]/10 to-transparent text-[#50ffb0] border-l-4 border-[#50ffb0]' 
                : 'text-[#ecedf6]/50 hover:bg-[#1c2028] hover:text-[#50ffb0]'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={location.pathname === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            <span>Overview</span>
          </a>
          <a
            onClick={() => navigate('/tracking')}
            className={`flex items-center gap-3 py-3 px-6 cursor-pointer transition-all ${
              location.pathname === '/tracking' 
                ? 'bg-gradient-to-r from-[#50ffb0]/10 to-transparent text-[#50ffb0] border-l-4 border-[#50ffb0]' 
                : 'text-[#ecedf6]/50 hover:bg-[#1c2028] hover:text-[#50ffb0]'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={location.pathname === '/tracking' ? { fontVariationSettings: "'FILL' 1" } : {}}>query_stats</span>
            <span>Live Tracking</span>
          </a>
          <a
            onClick={() => navigate('/contracts')}
            className={`flex items-center gap-3 py-3 px-6 cursor-pointer transition-all ${
              location.pathname === '/contracts' 
                ? 'bg-gradient-to-r from-[#50ffb0]/10 to-transparent text-[#50ffb0] border-l-4 border-[#50ffb0]' 
                : 'text-[#ecedf6]/50 hover:bg-[#1c2028] hover:text-[#50ffb0]'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={location.pathname === '/contracts' ? { fontVariationSettings: "'FILL' 1" } : {}}>history_edu</span>
            <span>Smart Contracts</span>
          </a>
          <a
            onClick={() => navigate('/nodes')}
            className={`flex items-center gap-3 py-3 px-6 cursor-pointer transition-all ${
              location.pathname === '/nodes' 
                ? 'bg-gradient-to-r from-[#50ffb0]/10 to-transparent text-[#50ffb0] border-l-4 border-[#50ffb0]' 
                : 'text-[#ecedf6]/50 hover:bg-[#1c2028] hover:text-[#50ffb0]'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={location.pathname === '/nodes' ? { fontVariationSettings: "'FILL' 1" } : {}}>hub</span>
            <span>Node Status</span>
          </a>
          <a
            onClick={() => navigate('/audit')}
            className={`flex items-center gap-3 py-3 px-6 cursor-pointer transition-all ${
              location.pathname === '/audit' 
                ? 'bg-gradient-to-r from-[#50ffb0]/10 to-transparent text-[#50ffb0] border-l-4 border-[#50ffb0]' 
                : 'text-[#ecedf6]/50 hover:bg-[#1c2028] hover:text-[#50ffb0]'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={location.pathname === '/audit' ? { fontVariationSettings: "'FILL' 1" } : {}}>security</span>
            <span>Audit Logs</span>
          </a>
        </nav>
        <div className="px-6 mb-6">
          <button onClick={() => navigate('/contracts')} className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-semibold py-2.5 rounded-lg flex justify-center items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-sm">add</span>
            Deploy Contract
          </button>
        </div>
        <div className="space-y-2 mt-auto">
          <a
            onClick={() => navigate('/settings')}
            className={`flex items-center gap-3 py-3 px-6 cursor-pointer transition-all ${
              location.pathname === '/settings' 
                ? 'bg-gradient-to-r from-[#50ffb0]/10 to-transparent text-[#50ffb0] border-l-4 border-[#50ffb0]' 
                : 'text-[#ecedf6]/50 hover:bg-[#1c2028] hover:text-[#50ffb0]'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={location.pathname === '/settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
            <span>Settings</span>
          </a>
          <a
            onClick={handleLogout}
            className="flex items-center gap-3 text-[#ecedf6]/50 py-3 px-6 hover:bg-[#1c2028] hover:text-error transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-background">
        {children}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(69, 72, 79, 0.5);
            border-radius: 4px;
        }
        .pulse-animation {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 113, 98, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 113, 98, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 113, 98, 0); }
        }
      `}</style>
    </div>
  );
};

export default Layout;
