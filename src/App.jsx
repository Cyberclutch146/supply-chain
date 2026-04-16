import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShipmentProvider } from './context/ShipmentContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ShipmentDetail from './pages/ShipmentDetail';
import AddShipment from './pages/AddShipment';
import AddCheckpoint from './pages/AddCheckpoint';
import LoadingScreen from './components/LoadingScreen';
import { Toaster } from 'react-hot-toast';
import { auth } from './services/firebase';
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

  if (!isAuthenticated) return <LoadingScreen />;

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
