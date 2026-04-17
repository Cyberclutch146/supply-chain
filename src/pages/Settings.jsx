import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Moon, Database } from 'lucide-react';
import { auth } from '../services/firebase';

const Settings = () => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#ecedf6] flex items-center gap-3">
          <SettingsIcon className="text-[#50ffb0]" size={32} />
          System Preferences
        </h1>
        <p className="text-[#a9abb3] text-sm mt-2">
          Manage your Node profile, cryptographic keys, and notification thresholds.
        </p>
      </header>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="bg-[#1c2028] p-6 rounded-xl border border-[#45484f]/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#10131a] border border-[#50ffb0]/30 flex items-center justify-center font-['Space_Grotesk'] text-2xl font-bold text-[#50ffb0]">
               A
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#ecedf6]">Admin.0x8F</h3>
              <p className="text-xs font-mono text-[#a9abb3] mt-1">Wallet: 0x8F9a...2B4c (Connected)</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 border border-[#ff7162]/30 text-[#ff7162] rounded-lg text-sm font-semibold hover:bg-[#ff7162]/10 transition-colors">
            Disconnect Wallet
          </button>
        </div>

        {/* Feature Toggles */}
        <div className="bg-[#10131a] rounded-xl border border-[#45484f]/20 overflow-hidden divide-y divide-[#45484f]/10">
          
          <div className="p-6 flex items-center justify-between hover:bg-[#1c2028]/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#50ffb0]/10 rounded-lg text-[#50ffb0]">
                <Shield size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[#ecedf6]">Strict Cryptographic Verification</div>
                <div className="text-xs text-[#a9abb3] mt-1">Require multi-node consensus for all local state changes.</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-[#22262f] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#50ffb0]"></div>
            </label>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-[#1c2028]/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#c5d0ec]/10 rounded-lg text-[#c5d0ec]">
                <Bell size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[#ecedf6]">Anomaly Push Notifications</div>
                <div className="text-xs text-[#a9abb3] mt-1">Receive alerts instantly when AI predicts >50% delay probability.</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-[#22262f] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#50ffb0]"></div>
            </label>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-[#1c2028]/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#ff7162]/10 rounded-lg text-[#ff7162]">
                <Database size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[#ecedf6]">Local Data Caching</div>
                <div className="text-xs text-[#a9abb3] mt-1">Store ledger copy locally for faster dashboard rendering.</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-[#22262f] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#50ffb0]"></div>
            </label>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;
