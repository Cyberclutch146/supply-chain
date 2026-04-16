import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShipmentProvider } from './context/ShipmentContext';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import ShipmentDetail from './views/ShipmentDetail';
import AddShipment from './views/AddShipment';
import AddCheckpoint from './views/AddCheckpoint';

function App() {
  return (
    <ShipmentProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shipment/:id" element={<ShipmentDetail />} />
            <Route path="/add-shipment" element={<AddShipment />} />
            <Route path="/add-checkpoint/:id" element={<AddCheckpoint />} />
          </Routes>
        </Layout>
      </Router>
    </ShipmentProvider>
  );
}

export default App;
