import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';

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
    <div>
      <h2 className="mb-4">Add Checkpoint</h2>
      <p className="text-sm mb-4" style={{color: 'var(--text-secondary)'}}>Logging immutable event for: {id}</p>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Location</label>
            <input 
              type="text" 
              placeholder="e.g. Highway Rest Stop 42"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <label>Status Update</label>
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="In Transit">In Transit</option>
              <option value="Stopped">Stopped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="input-group">
            <label>Auto-Simulate Scenario (Demo Mode)</label>
            <select 
              value={formData.scenario}
              onChange={e => setFormData({...formData, scenario: e.target.value})}
              style={{ borderLeft: '4px solid var(--brand-primary)' }}
            >
              {Object.keys(scenarioMap).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Tampered">⚠️ Simulate Data Tampering</option>
            </select>
            <p className="text-sm mt-2" style={{color: 'var(--text-secondary)'}}>
              Selecting a scenario automatically populates the 7-dimensional risk matrix (Driver, Traffic, Environment, etc.) behind the scenes.
            </p>
          </div>
          
          <button type="submit" className="btn mt-4">Record Immutable Checkpoint</button>
        </form>
      </div>
    </div>
  );
};

export default AddCheckpoint;
