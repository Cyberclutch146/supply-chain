import React, { useMemo, useState } from 'react';
import { useShipments } from '../context/ShipmentContext';

const AuditLogs = () => {
  const { shipments } = useShipments();
  const [filter, setFilter] = useState('all');

  const allLogs = useMemo(() => {
    let logs = [];
    shipments.forEach(s => {
      if (s.checkpoints) {
        s.checkpoints.forEach(cp => {
          logs.push({
            ...cp,
            shipmentId: s.id,
            shipmentItem: s.item
          });
        });
      }
    });
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs;
  }, [shipments]);

  const filteredLogs = useMemo(() => {
    if (filter === 'all') return allLogs;
    if (filter === 'verified') return allLogs.filter(l => l.verified);
    if (filter === 'tampered') return allLogs.filter(l => !l.verified);
    return allLogs;
  }, [allLogs, filter]);

  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col">
      <header className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Immutable Audit Logs</h1>
          <p className="text-on-surface-variant text-sm mt-1">Cryptographic ledger entries for all global transits.</p>
        </div>
        <div className="flex gap-2 bg-surface-container-low p-1 border border-[rgba(69,72,79,0.3)] rounded-lg">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === 'all' ? 'bg-[#1c2028] text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            All Entries
          </button>
          <button 
            onClick={() => setFilter('verified')} 
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === 'verified' ? 'bg-[#1c2028] text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Verified Only
          </button>
          <button 
            onClick={() => setFilter('tampered')} 
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === 'tampered' ? 'bg-[#1c2028] text-tertiary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Anomalies
          </button>
        </div>
      </header>

      <div className="flex-1 bg-[#1c2028]/80 backdrop-blur-md border border-[rgba(69,72,79,0.15)] rounded-xl flex flex-col overflow-hidden">
        <div className="bg-surface-container-lowest/50 border-b border-[rgba(69,72,79,0.2)] px-6 py-3 flex text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          <div className="w-12">Stat</div>
          <div className="w-48">Timestamp</div>
          <div className="flex-1">Asset Identity / Hash Signatures</div>
          <div className="w-48 text-right">Event Node</div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredLogs.map((log, i) => (
            <div key={i} className="flex px-6 py-4 border-b border-[rgba(69,72,79,0.1)] hover:bg-surface-container-low transition-colors items-start">
              <div className="w-12 pt-1 mt-0.5">
                <span className={`material-symbols-outlined text-xl ${log.verified ? 'text-primary' : 'text-tertiary'}`}>
                  {log.verified ? 'lock' : 'gpp_bad'}
                </span>
              </div>
              <div className="w-48">
                <div className="text-sm font-medium text-on-surface">{new Date(log.timestamp).toLocaleDateString()}</div>
                <div className="text-xs text-on-surface-variant font-mono">{new Date(log.timestamp).toLocaleTimeString()}</div>
              </div>
              <div className="flex-1 pr-4">
                <div className="text-sm font-medium text-on-surface mb-1">{log.shipmentItem} <span className="opacity-50 font-normal">({log.shipmentId.substring(0,8)})</span></div>
                <div className="bg-[#12141a] p-2 rounded flex flex-col gap-1 border border-[rgba(69,72,79,0.15)]">
                  <div className="flex text-[10px] items-center">
                    <span className="text-on-surface-variant/40 w-8">TX</span>
                    <span className="font-mono text-primary/80 truncate block">{log.txHash}</span>
                  </div>
                  <div className="flex text-[10px] items-center">
                    <span className="text-on-surface-variant/40 w-8">ZKP</span>
                    <span className={`font-mono truncate block ${log.verified ? 'text-on-surface-variant' : 'text-tertiary'}`}>
                      {log.verificationHash}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-48 text-right">
                <div className="text-sm font-bold text-on-surface-variant">{log.location}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 inline-block px-1.5 py-0.5 rounded ${log.status === 'Stopped' ? 'bg-secondary-container/20 text-secondary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  {log.status}
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant opacity-60">
              <span className="material-symbols-outlined text-4xl mb-4">search_off</span>
              <div className="text-sm">No ledger entries found matching criteria.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
