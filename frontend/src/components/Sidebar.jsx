import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Wallet, PieChart, Target, User, Settings, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Failed to log out");
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="/Images/SETS%20LOGO.png" alt="SETS Logo" style={{ width: '80px', height: 'auto' }} />
          <button className="mobile-close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} onClick={handleLinkClick}>
            <Home size={20} className="sidebar-icon" />
            Home
          </NavLink>
          <NavLink to="/dashboard/wallets" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} onClick={handleLinkClick}>
            <Wallet size={20} className="sidebar-icon" />
            Wallets
          </NavLink>
          <NavLink to="/dashboard/budget" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} onClick={handleLinkClick}>
            <Target size={20} className="sidebar-icon" />
            Budget
          </NavLink>
          <NavLink to="/dashboard/analytics" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} onClick={handleLinkClick}>
            <PieChart size={20} className="sidebar-icon" />
            Analytics
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar" style={{ marginRight: '12px', fontSize: '14px', flexShrink: 0 }}>
            {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
          </div>
          <div className="user-info" style={{ minWidth: 0, overflow: 'hidden' }}>
            <span className="user-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{currentUser?.displayName || 'Student User'}</span>
            <span className="user-role" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{currentUser?.email || ''}</span>
          </div>
          <button className="settings-btn" aria-label="Logout" onClick={handleLogout} style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
