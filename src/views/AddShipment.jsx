import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';

const AddShipment = () => {
  const navigate = useNavigate();
  const { addShipment } = useShipments();
  
  const [formData, setFormData] = useState({
    id: `SHP-${Math.floor(Math.random() * 90000) + 10000}`,
    origin: '',
    destination: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) return;
    
    addShipment(formData);
    navigate('/'); // redirect to dashboard
  };

  return (
    <div>
      <h2 className="mb-4">Create Shipment</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Shipment ID (Auto-generated)</label>
            <input type="text" value={formData.id} disabled />
          </div>
          
          <div className="input-group">
            <label>Origin</label>
            <input 
              type="text" 
              placeholder="e.g. New York, US"
              value={formData.origin}
              onChange={e => setFormData({...formData, origin: e.target.value})}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Destination</label>
            <input 
              type="text" 
              placeholder="e.g. London, UK"
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className="btn mt-4">Create Shipment</button>
        </form>
      </div>
    </div>
  );
};

export default AddShipment;
