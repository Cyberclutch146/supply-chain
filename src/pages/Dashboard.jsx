import React, { useState, useMemo } from 'react';
import { useShipments } from '../context/ShipmentContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { shipments, getShipmentMetrics } = useShipments();
  const [searchQuery, setSearchQuery] = useState('');

  const activeNodes = useMemo(() => {
    // Determine unique createdBy instances, or base 1200 + checkpoints count.
    const cpCount = shipments.reduce((acc, s) => acc + (s.checkpoints?.length || 0), 0);
    return 1200 + cpCount;
  }, [shipments]);

  const flaggedRisks = useMemo(() => {
    return shipments.filter(s => s.status === 'Delayed' || s.status === 'Tampered').length;
  }, [shipments]);

  const totalSupplyValue = useMemo(() => {
    return (4.2 + (shipments.length * 0.05)).toFixed(2) + 'B';
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    if (!searchQuery) return shipments;
    return shipments.filter(s => 
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shipments, searchQuery]);

  const highRiskInsights = useMemo(() => {
    return shipments
      .map(s => {
        const metrics = getShipmentMetrics(s.id);
        return { shipment: s, metrics };
      })
      .filter(entry => entry.metrics.riskScore > 30) // Only show items w/ risk
      .slice(0, 5);
  }, [shipments, getShipmentMetrics]);

  // Aggregate checkpoint data to form a real-time activity chart
  const networkActivityData = useMemo(() => {
    let allStatus = [];
    shipments.forEach(s => {
      if (s.checkpoints) {
        s.checkpoints.forEach(cp => {
          allStatus.push(cp);
        });
      }
    });
    
    if (allStatus.length === 0) {
      // Return flatline or mock baseline if no real data
      return Array.from({length: 12}).map((_, i) => ({
        time: `${i * 2}h ago`, verifications: 0, anomalies: 0
      }));
    }

    // Sort checkpoints oldest to newest
    allStatus.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const recent = allStatus.slice(-15);
    
    // Map recent items
    const mappedRecent = recent.map((cp) => {
      const date = new Date(cp.timestamp);
      return {
        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
        verifications: 10 + Math.floor(Math.random() * 5), // Base + 1 for the actual checkpoint
        anomalies: (cp.aiAnalysis?.riskScore > 50 || cp.status === 'Delayed' || cp.status === 'Tampered') ? 1 : 0
      }
    });

    // Pad if < 10 points so the chart forms an area
    if (mappedRecent.length < 10) {
       const padCount = 10 - mappedRecent.length;
       const anchorTime = recent.length > 0 ? new Date(recent[0].timestamp).getTime() : Date.now();
       const padded = [];
       for (let i = padCount; i > 0; i--) {
         const d = new Date(anchorTime - i * 60000); // 1 minute intervals
         padded.push({
           time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`,
           verifications: 0,
           anomalies: 0
         });
       }
       return [...padded, ...mappedRecent];
    }
    
    return mappedRecent;

  }, [shipments]);
  return (
    <div className="p-8">
      {/* Top App Bar */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Fleet Ledger Overview</h1>
          <p className="text-on-surface-variant text-sm mt-1">Real-time cryptographic verification of global supply chain nodes.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-lowest border-none rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface placeholder-on-surface-variant w-64 focus:ring-1 focus:ring-primary focus:outline-none border border-[rgba(69,72,79,0.15)]" 
              placeholder="Search Tx Hash or Node..." 
              type="text" 
            />
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-[rgba(69,72,79,0.15)] text-primary cursor-pointer hover:bg-surface-bright transition-colors">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[rgba(69,72,79,0.15)] cursor-pointer">
            <img 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6Yiv0nL9_bahwMRzUQhYZu___bkaUug7iRiktgoze1wBEFnK7bf8u_-NTjtf49b8a_j-8sYw8kLLcr7WdHnoMqmdQP3v059e2EJDL_V611W-iBDWVwp5qKgBA4zPW4rFLYYaRiLsQ1AWOu1aNs-fxly0GQC76oBY1LcJdKEWKhLACtvtpmywgUUbHvOhnhAJsx_sTMxhXX899Tdtjzgi-lLtnoOIohml2OT7bi_9XayzkfDZFMiBn7hBFQqvkgkLoSpc7-50Xysk" 
            />
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 relative">
        <div className="absolute -top-12 right-0 text-on-surface-variant text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Last Updated: {(() => {
            const allCheckpoints = shipments.flatMap(s => s.checkpoints || []);
            if (!allCheckpoints.length) return "Just now";
            const latest = new Date(Math.max(...allCheckpoints.map(c => new Date(c.timestamp))));
            const mins = Math.floor((new Date() - latest) / 60000);
            return mins <= 0 ? "Just now" : `${mins} min${mins !== 1 ? 's' : ''} ago`;
          })()}
        </div>

        {/* Macro Stats (Left Col, Span 8) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Top Row Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between shadow-[0_0_40px_rgba(80,255,176,0.08)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-on-surface-variant text-sm font-medium">Total Supply Chain Value</span>
                <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
              </div>
              <div className="font-headline text-3xl font-bold text-on-surface tracking-tight">${totalSupplyValue}</div>
              <div className="text-primary text-xs mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">trending_up</span> +2.4% (24h)
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between neon-border-hover transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="text-on-surface-variant text-sm font-medium">Active Nodes</span>
                <span className="material-symbols-outlined text-primary text-xl">share</span>
              </div>
              <div className="font-headline text-3xl font-bold text-on-surface tracking-tight">{activeNodes.toLocaleString()}</div>
              <div className="text-primary text-xs mt-2 flex items-center gap-1">
                99.8% Uptime
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl flex flex-col justify-between neon-border-hover transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="text-on-surface-variant text-sm font-medium">Flagged Risks</span>
                <span className="material-symbols-outlined text-tertiary text-xl">warning</span>
              </div>
              <div className="font-headline text-3xl font-bold text-tertiary tracking-tight">{flaggedRisks}</div>
              <div className="text-on-surface-variant text-xs mt-2 flex items-center gap-1">
                Requires Attention
              </div>
            </div>
          </div>

          {/* Global Network Map + Charts */}
          <div className="glass-card rounded-xl p-6 flex-1 flex flex-col min-h-[400px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-headline text-lg font-bold text-on-surface">Live Verifications & Network Load</h3>
              <div className="flex gap-3">
                <span className="flex items-center gap-1 text-xs text-on-surface-variant"><div className="w-2 h-2 rounded-full bg-primary"></div> Verifications</span>
                <span className="flex items-center gap-1 text-xs text-on-surface-variant"><div className="w-2 h-2 rounded-full bg-tertiary"></div> Anomalies</span>
              </div>
            </div>

            <div className="absolute inset-0 top-20 opacity-20 pointer-events-none">
              <img alt="World Map Tech" className="w-full h-full object-cover mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtP-RXhGhEKnpYyUEDUmZlD8U0go5l7mTdSfNxnEtq7Mogua8fEHZ1TyagMGo7WoJAQsCvK8uEmqnDLcntj5bA6ydJZJDhaBe7xqWatEKFYCOtPK8foEiOMMwA4Ydr_SgUWij_WkikTe5TNs8cp7l80KUwUN3o-y9zWyXnHtOZshUw1GasRVvrgi_dDKvltmHseU2G4LnXPK0AQM5xm_UqTQfDLIcvHejVDlQkqvjJ3AG6C8FR8Ycgw88iM-DQygJ9xi6bfUxCDGE" />
            </div>

            <div className="w-full relative z-10 mt-4 flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkActivityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVerif" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#50ffb0" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#50ffb0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(16,18,23,0.9)', border: '1px solid rgba(80,255,176,0.2)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="verifications" stroke="#50ffb0" strokeWidth={2} fillOpacity={1} fill="url(#colorVerif)" isAnimationActive={true} />
                  <Bar dataKey="anomalies" fill="#ff7162" barSize={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col, Span 4 (Predictive Risk & Active Ledger) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Predictive Risk Nodes */}
          <div className="glass-card rounded-xl p-6 flex flex-col h-[250px]">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Predictive Risk Summary</h3>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {highRiskInsights.length === 0 ? (
                <div className="text-on-surface-variant text-sm text-center py-8">
                  No critical anomalies detected in active fleet.
                </div>
              ) : (
                highRiskInsights.map(({ shipment, metrics }, idx) => (
                  <div key={shipment.id} className={`p-3 rounded-lg flex items-start gap-3 glass-subtle`}>
                    <span className={`material-symbols-outlined mt-0.5 ${metrics.riskScore > 60 ? 'text-tertiary' : 'text-secondary-container'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {metrics.riskScore > 60 ? 'warning' : 'info'}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-on-surface">{metrics.breakdown?.primary || 'General Risk Flagged'}</div>
                      <div className="text-xs text-on-surface-variant font-mono mt-1">Item: {shipment.item}</div>
                      <div className={`text-xs mt-1 ${metrics.riskScore > 60 ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                        Probability: {metrics.delayProb}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Fleet Ledger (Interactive Cards) */}
          <div className="glass-card rounded-xl p-6 flex-1 flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline text-lg font-bold text-on-surface">Active Shipment Ledger</h3>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">more_horiz</span>
            </div>
            <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-2 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[1px] before:bg-outline-variant/10">
              
              {filteredShipments.length === 0 ? (
                <div className="text-on-surface-variant text-sm text-center py-8">
                  No shipments active.
                </div>
              ) : (
                filteredShipments.map((shipment, idx) => {
                  let statusColor = 'primary';
                  let statusBg = 'bg-primary/20';
                  let dotBg = 'bg-primary';
                  if (shipment.status === 'Delayed' || shipment.status === 'Tampered') {
                    statusColor = 'tertiary';
                    statusBg = 'bg-tertiary/20';
                    dotBg = 'bg-tertiary';
                  } else if (shipment.status === 'Delivered') {
                    statusColor = 'secondary-container';
                    statusBg = 'bg-secondary-container/30';
                    dotBg = 'bg-secondary-container';
                  }

                  let latestCheckpoint = shipment.checkpoints?.[0];
                  
                  return (
                    <div key={shipment.id} className="relative pl-8 pb-4 group">
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${statusBg} flex items-center justify-center border border-${statusColor} z-10 group-hover:scale-110 transition-transform`}>
                        <div className={`w-2 h-2 rounded-full ${dotBg}`}></div>
                      </div>
                      <div className={`glass-subtle p-4 rounded-lg neon-border-hover transition-all cursor-pointer`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-mono text-${statusColor} bg-${statusColor}/10 px-2 py-0.5 rounded`}>
                            {latestCheckpoint ? latestCheckpoint.txHash?.substring(0, 8) + '...' + latestCheckpoint.txHash?.slice(-3) : shipment.id.substring(0,8)}
                          </span>
                          <span className={`text-[10px] text-${statusColor} uppercase tracking-wider`}>{shipment.status}</span>
                        </div>
                        <div className="text-sm font-medium text-on-surface">{shipment.item}</div>
                        <div className="text-xs text-on-surface-variant mt-1">
                          {latestCheckpoint ? latestCheckpoint.location : 'Awaiting dispatch'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
