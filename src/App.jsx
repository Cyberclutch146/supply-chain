import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ShipmentProvider } from './context/ShipmentContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Tracking from './pages/Tracking';
import Contracts from './pages/Contracts';
import NodeStatus from './pages/NodeStatus';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import LoadingScreen from './components/LoadingScreen';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsInitializing(false);
    });
    return () => unsub();
  }, []);

  if (isInitializing) return <LoadingScreen />;

  return (
    <ShipmentProvider>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1c2028', color: '#fff', border: '1px solid rgba(69,72,79,0.3)' },
        success: { iconTheme: { primary: '#50ffb0', secondary: '#1c2028' } }
      }} />
      <Router>
        <Routes>
          <Route path="/landing" element={!isAuthenticated ? <Landing /> : <Navigate to="/" />} />
          
          <Route path="/*" element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tracking" element={<Tracking />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/nodes" element={<NodeStatus />} />
                  <Route path="/audit" element={<AuditLogs />} />
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
