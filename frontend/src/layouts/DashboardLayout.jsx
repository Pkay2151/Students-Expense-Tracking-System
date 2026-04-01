import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';

function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Mobile Top Navigation */}
      <div className="mobile-header">
        <h1 className="brand-title" style={{fontSize: '24px', margin: 0}}>SETS</h1>
        <button className="icon-btn" style={{border: 'none', background: 'transparent', boxShadow: 'none', padding: 0, width: 'auto'}} onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} color="var(--text-main)" />
        </button>
      </div>

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
