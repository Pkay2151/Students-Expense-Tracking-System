import React, { useState } from 'react';
import { Plus, Building2, Smartphone, Banknote, Filter, ArrowRightLeft, ArrowRight, Utensils, Bus, Lightbulb, Book, Film, QrCode } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import AddWalletModal from '../components/AddWalletModal';
import QuickTransferModal from '../components/QuickTransferModal';
import Button from '../components/Button';
import './Dashboard.css';

function Wallets() {
  const { state } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const getIconForType = (type) => {
    switch (type) {
      case 'bank': return <Building2 size={16} opacity={0.6} />;
      case 'mobile': return <Smartphone size={16} opacity={0.6} />;
      case 'cash': return <Banknote size={16} color="var(--primary)" />;
      default: return <Building2 size={16} opacity={0.6} />;
    }
  };

  const getColorClass = (type) => {
    switch (type) {
      case 'bank': return 'dark';
      case 'mobile': return 'mint';
      case 'cash': return 'light';
      default: return 'light';
    }
  };

  const recentTransactions = state.transactions.slice(0, 10);

  const getCategoryConfig = (category, type) => {
    if (type === 'transfer') return { icon: <ArrowRightLeft size={18} color="#1d4ed8" />, bg: '#dbeafe' };
    if (type === 'income') return { icon: <Plus size={18} color="#159a83" />, bg: '#dff2ec' };
    switch(category) {
      case 'Food & Drinks': return { icon: <Utensils size={18} color="#b87a1d" />, bg: '#fdeaca' };
      case 'Transport': return { icon: <Bus size={18} color="#1d4ed8" />, bg: '#dbeafe' };
      case 'Learning Materials': return { icon: <Book size={18} color="#6d28d9" />, bg: '#ede9fe' };
      case 'Utilities': return { icon: <Lightbulb size={18} color="#047857" />, bg: '#d1fae5' };
      case 'Entertainment': return { icon: <Film size={18} color="#be185d" />, bg: '#fce7f3' };
      default: return { icon: <QrCode size={18} color="#4b5563" />, bg: '#f3f4f6' };
    }
  };

  return (
    <div className="page-wrapper">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-page-title">My Wallets</h1>
          <p className="dashboard-page-subtitle">Manage your assets across different platforms</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary btn-sm" style={{ borderRadius: '24px' }} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Add Account
          </button>
        </div>
      </header>

      {/* Top Cards Grid */}
      <div className="wallets-cards-grid">
        {state.wallets.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'white', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No accounts added yet. Click "+ Add Account" to get started.</p>
          </div>
        ) : (
          state.wallets.map(w => (
            <div key={w.id} className={`wallet-card ${getColorClass(w.type)}`}>
              <div className="wallet-card-header">
                <span>{w.name}</span>
                {getIconForType(w.type)}
              </div>
              <h2 className="wallet-card-balance">GH¢{w.balance.toFixed(2)}</h2>
              <div className="wallet-card-footer">
                <span style={w.type === 'cash' ? { color: 'var(--text-muted)' } : {}}>Active Balance</span>
                <ArrowRight size={16} color={w.type === 'cash' ? 'var(--text-main)' : undefined} />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="grid-left">
          <div className="widget-card">
            <div className="widget-header" style={{ marginBottom: '16px' }}>
              <h3>Recent Activity</h3>
              <div className="search-filter-bar">
                <input type="text" className="search-input" placeholder="Search transactions..." />
                <button className="filter-btn"><Filter size={16} /> Filters</button>
              </div>
            </div>

            <div className="activity-list" style={{ boxShadow: 'none', padding: 0 }}>
              {recentTransactions.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>No recent transactions found.</p>
              ) : (
                recentTransactions.map(t => {
                  const wallet = state.wallets.find(w => w.id === t.walletId);
                  const config = getCategoryConfig(t.category, t.type);
                  return (
                    <ActivityItem
                      key={t.id}
                      icon={config.icon}
                      iconBg={config.bg}
                      title={t.title}
                      subtitle={`${wallet ? wallet.name : 'Unknown Account'} • ${new Date(t.date).toLocaleDateString()}`}
                      amount={t.type === 'transfer' ? `GH¢${parseFloat(t.amount).toFixed(2)}` : `${t.type === 'income' ? '+' : '-'}GH¢${parseFloat(t.amount).toFixed(2)}`}
                      badge={t.category}
                      type={t.type}
                    />
                  )
                })
              )}
            </div>

            {recentTransactions.length > 0 && (
              <div className="text-center mt-24">
                <button className="btn-link">View All History</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="grid-right">

          {state.wallets.length >= 2 && (
            <div className="quick-move-card">
              <h4 style={{ marginBottom: '16px' }}>Quick Move</h4>
              <p style={{fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px'}}>Move money safely between your active accounts.</p>
              <Button variant="primary" width="100%" onClick={() => setIsTransferModalOpen(true)}>Transfer Now</Button>
            </div>
          )}

        </div>
      </div>

      <AddWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <QuickTransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} />
    </div>
  );
}

const ActivityItem = ({ icon, iconBg, title, subtitle, amount, badge, type }) => (
  <div className="activity-item">
    <div className="activity-icon" style={{ backgroundColor: iconBg }}>{icon}</div>
    <div className="activity-details" style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
      {badge && (
        <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f0f0f0', marginRight: '32px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {badge}
        </span>
      )}
    </div>
    <div className={`activity-amount ${type}`}>{amount}</div>
  </div>
);

export default Wallets;
