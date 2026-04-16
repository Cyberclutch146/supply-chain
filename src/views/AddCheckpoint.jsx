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
    idleTime: 0,
    harshBrakes: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.location) return;

    addCheckpoint(id, {
      ...formData,
      idleTime: Number(formData.idleTime),
      harshBrakes: Number(formData.harshBrakes)
    });
    
    navigate(`/shipment/${id}`); // redirect to details
  };

  return (
    <div>
      <h2 className="mb-4">Add Checkpoint</h2>
      <p className="text-sm mb-4">For Shipment: {id}</p>
      
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
            <label>Status</label>
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="In Transit">In Transit</option>
              <option value="Stopped">Stopped</option>
              <option value="Delivered">Delivered</option>
              <option value="Tampered">Simulate Tampering (Demo)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Idle Time (Minutes)</label>
            <input 
              type="number" 
              min="0"
              value={formData.idleTime}
              onChange={e => setFormData({...formData, idleTime: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Harsh Brakes (Count since last check)</label>
            <input 
              type="number" 
              min="0"
              value={formData.harshBrakes}
              onChange={e => setFormData({...formData, harshBrakes: e.target.value})}
            />
          </div>
          
          <button type="submit" className="btn mt-4">Record Checkpoint</button>
        </form>
      </div>
    </div>
  );
};

export default AddCheckpoint;
