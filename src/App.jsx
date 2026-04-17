import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ShipmentProvider } from './context/ShipmentContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ShipmentDetail from './pages/ShipmentDetail';
import AddShipment from './pages/AddShipment';
import AddCheckpoint from './pages/AddCheckpoint';
import Landing from './pages/Landing';
import PredictiveRisk from './pages/PredictiveRisk';
import SmartContracts from './pages/SmartContracts';
import NodeStatus from './pages/NodeStatus';
import Settings from './pages/Settings';
import LoadingScreen from './components/LoadingScreen';
import { Toaster } from 'react-hot-toast';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (isInitializing) return <LoadingScreen />;

  return (
    <ShipmentProvider>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1A202C',
          color: '#fff',
          border: '1px solid #2D3748',
        },
        success: {
          iconTheme: {
            primary: '#50ffb0',
            secondary: '#1A202C',
          },
        },
      }} />
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/landing" element={!isAuthenticated ? <Landing /> : <Navigate to="/" />} />
          
          {/* Protected Routes enclosed in Layout */}
          <Route path="/*" element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/shipment/:id" element={<ShipmentDetail />} />
                  <Route path="/add-shipment" element={<AddShipment />} />
                  <Route path="/add-checkpoint/:id" element={<AddCheckpoint />} />
                  <Route path="/risk" element={<PredictiveRisk />} />
                  <Route path="/contracts" element={<SmartContracts />} />
                  <Route path="/nodes" element={<NodeStatus />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/landing" />
            )
          } />
        </Routes>
      </Router>
    </ShipmentProvider>
  );
}

export default App;
