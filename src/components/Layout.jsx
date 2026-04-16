import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ArrowLeft } from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <>
      <header className="layout-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isHome && (
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h1>ChainSight</h1>
        </div>
        
        {isHome && (
          <button 
            onClick={() => navigate('/add-shipment')}
            style={{ background: 'transparent', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <PlusCircle size={24} />
          </button>
        )}
      </header>

      <main className="layout-content">
        {children}
      </main>
    </>
  );
};

export default Layout;
