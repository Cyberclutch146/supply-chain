import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShipmentProvider } from './context/ShipmentContext';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import ShipmentDetail from './views/ShipmentDetail';
import AddShipment from './views/AddShipment';
import AddCheckpoint from './views/AddCheckpoint';
import { auth } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Auth error:", error);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthenticated) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-[#50ffb0]">Initializing...</div>;

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
