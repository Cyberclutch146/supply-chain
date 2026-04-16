import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { ArrowLeft, Save } from 'lucide-react';

const AddCheckpoint = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addCheckpoint } = useShipments();

  const [formData, setFormData] = useState({
    location: '',
    status: 'In Transit',
    scenario: 'Normal'
  });

  const scenarioMap = {
    'Normal': { idleTime: 0, harshBrakes: 0, trafficLevel: 'low', waitTime: 5, vehicleStatus: 'ok', weather: 'clear', checkpointDelay: 0, routeDeviation: false },
    'Heavy Traffic': { idleTime: 15, harshBrakes: 5, trafficLevel: 'high', waitTime: 10, vehicleStatus: 'ok', weather: 'clear', checkpointDelay: 0, routeDeviation: false },
    'Driver Fatigue': { idleTime: 65, harshBrakes: 12, trafficLevel: 'low', waitTime: 5, vehicleStatus: 'ok', weather: 'clear', checkpointDelay: 0, routeDeviation: false },
    'Vehicle Breakdown': { idleTime: 120, harshBrakes: 2, trafficLevel: 'medium', waitTime: 45, vehicleStatus: 'breakdown', weather: 'clear', checkpointDelay: 0, routeDeviation: false },
    'Severe Weather': { idleTime: 30, harshBrakes: 8, trafficLevel: 'medium', waitTime: 20, vehicleStatus: 'warning', weather: 'storm', checkpointDelay: 0, routeDeviation: false },
    'Route Deviation (Theft Risk)': { idleTime: 0, harshBrakes: 0, trafficLevel: 'low', waitTime: 0, vehicleStatus: 'ok', weather: 'clear', checkpointDelay: 0, routeDeviation: true },
    'Compliance/Border Delay': { idleTime: 45, harshBrakes: 0, trafficLevel: 'low', waitTime: 40, vehicleStatus: 'ok', weather: 'clear', checkpointDelay: 30, routeDeviation: false }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.location) return;

    let finalStatus = formData.status;
    if (formData.scenario === 'Tampered') {
      finalStatus = 'Tampered';
    }

    const payload = {
      location: formData.location,
      status: finalStatus,
      ...(scenarioMap[formData.scenario] || scenarioMap['Normal'])
    };

    addCheckpoint(id, payload);
    navigate(`/shipment/${id}`);
  };

  return (
    <div className="px-4 md:px-8 py-6 w-full max-w-2xl mx-auto flex flex-col gap-y-8">
      <header className="flex items-center gap-4 pb-2">
        <button onClick={() => navigate(-1)} className="text-[#50ffb0] hover:text-white transition-colors bg-[#50ffb0]/10 p-2 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Add Ledger Event</h2>
          <p className="text-xs text-on-surface-variant font-mono crypto-mono mt-1">Target Node: <span className="text-[#50ffb0]">{id}</span></p>
        </div>
      </header>
      
      <div className="glass-card rounded-xl p-6 md:p-8 relative overflow-hidden neon-border-hover transition-all duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Geolocation</label>
            <input 
              type="text" 
              placeholder="e.g. Highway Rest Stop 42"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              required
              className="w-full bg-[#0b0e14] border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-[#50ffb0] focus:ring-1 focus:ring-[#50ffb0] transition-all font-mono text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">State Transition</label>
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full bg-[#0b0e14] border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-[#50ffb0] focus:ring-1 focus:ring-[#50ffb0] transition-all font-mono text-sm"
            >
              <option value="In Transit">In Transit</option>
              <option value="Stopped">Stopped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 border-t border-outline-variant/10 pt-6 mt-2">
            <label className="text-[10px] font-bold text-[#50ffb0] uppercase tracking-wider">AI Scenario Simulation (Demo Matrix)</label>
            <select 
              value={formData.scenario}
              onChange={e => setFormData({...formData, scenario: e.target.value})}
              className="w-full bg-[#50ffb0]/5 border border-[#50ffb0]/30 text-[#50ffb0] font-bold rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff7162] focus:ring-1 focus:ring-[#ff7162] transition-all font-mono text-sm appearance-none"
            >
              {Object.keys(scenarioMap).map(s => (
                <option key={s} value={s} className="bg-surface text-on-surface">{s}</option>
              ))}
              <option value="Tampered" className="bg-[#ff7162]/20 text-[#ff7162] font-bold">⚠️ Simulate Data Tampering</option>
            </select>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-1 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
              Selecting a scenario automatically populates the 7-dimensional risk matrix (Driver Fatigue, Traffic, Environment variables) behind the scenes, triggering the continuous AI anomaly detection engine.
            </p>
          </div>
          
          <button type="submit" className="pulse-btn mt-6 py-4 rounded-lg font-bold shadow-neon flex justify-center items-center gap-2">
            <Save size={18} /> Sign & Broadcast Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCheckpoint;
