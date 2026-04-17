import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Subscribe to user doc
        const unsubDoc = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setWalletAddress(data.walletAddress);
            setNodeId(data.nodeId);
          }
          setLoading(false);
        });
        return () => unsubDoc();
      } else {
        setWalletAddress(null);
        setNodeId(null);
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, walletAddress, nodeId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
