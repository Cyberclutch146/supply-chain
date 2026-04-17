import React from 'react';
import { useShipments } from '../context/ShipmentContext';

const NodeStatus = () => {
  const { shipments } = useShipments();

  // Generate some deterministic mock nodes based on shipment data
  const baseNodes = [
    { id: 'nl-01', location: 'Rotterdam, NLD', role: 'Primary Verifier', uptime: 99.98, latency: 12, bandwidth: '2.4 Gbps', load: 45 },
    { id: 'sg-04', location: 'Singapore Port', role: 'Edge Gateway', uptime: 99.50, latency: 8, bandwidth: '5.0 Gbps', load: 82 },
    { id: 'us-la-02', location: 'Los Angeles, USA', role: 'Risk Analyzer', uptime: 99.99, latency: 45, bandwidth: '1.2 Gbps', load: 24 },
    { id: 'ae-01', location: 'Dubai, UAE', role: 'Logistics Oracle', uptime: 98.40, latency: 110, bandwidth: '800 Mbps', load: 60 },
    { id: 'kr-02', location: 'Busan, KOR', role: 'Verifier', uptime: 99.90, latency: 24, bandwidth: '1.0 Gbps', load: 30 },
  ];

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Network Nodes</h1>
          <p className="text-on-surface-variant text-sm mt-1">Real-time status of decentralized infrastructure and verifiers.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-form px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#50ffb0]"></div>
            <span className="text-sm font-medium text-on-surface">Consensus: Healthy</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
          <div className="text-sm text-on-surface-variant font-medium mb-2">Global Uptime (Average)</div>
          <div className="font-headline text-3xl font-bold text-primary">99.85%</div>
        </div>
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
          <div className="text-sm text-on-surface-variant font-medium mb-2">Total Verifications (24H)</div>
          <div className="font-headline text-3xl font-bold text-on-surface">
            {15420 + shipments.reduce((acc, s) => acc + (s.checkpoints?.length || 0), 0)}
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
          <div className="text-sm text-on-surface-variant font-medium mb-2">Network Load</div>
          <div className="font-headline text-3xl font-bold text-secondary-container">Moderate</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)] bg-transparent">
              <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Node Identity</th>
              <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Location / Region</th>
              <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Role</th>
              <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Health & Load</th>
              <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Network Stats</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {baseNodes.map((n, i) => (
              <tr key={n.id} className="hover:bg-[#ffffff05] transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded glass-subtle border border-[rgba(255,255,255,0.05)] flex items-center justify-center font-mono text-xs text-on-surface-variant">
                      {n.id}
                    </div>
                    <div>
                      <div className="font-medium text-on-surface text-sm">Validating Node</div>
                      <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">0x{(Math.random()*100000).toString(16).substring(0,8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-on-surface">{n.location}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                    {n.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="w-full max-w-[150px]">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={n.uptime < 99 ? 'text-tertiary' : 'text-on-surface-variant'}>{n.uptime}% uptime</span>
                      <span className="text-on-surface-variant">{n.load}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${n.load > 75 ? 'bg-tertiary' : 'bg-primary'}`}
                        style={{ width: `${n.load}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant">speed</span>
                      <span className="text-xs font-mono text-on-surface">{n.latency}ms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant">swap_vert</span>
                      <span className="text-xs font-mono text-on-surface">{n.bandwidth}</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NodeStatus;
