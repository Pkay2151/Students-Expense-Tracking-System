import React, { useState } from 'react';
import { Bell, Plus, Bus, Book, Lightbulb, Utensils, QrCode, ArrowRightLeft, Film } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import AddTransactionModal from '../components/AddTransactionModal';
import { NavLink } from 'react-router-dom';
import './Dashboard.css';

function Home() {
  const { state } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic calculations
  const totalBalance = state.wallets.reduce((sum, w) => sum + w.balance, 0);
  
  const currentMonthTransactions = state.transactions; 
  
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const recentTransactions = state.transactions.slice(0, 4);

  // Dynamic Monthly Budget for right column
  const topBudgets = state.budgets.slice(0, 3);
  const totalBudgeted = state.budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalBudgetSpent = state.transactions
    .filter(t => t.type === 'expense' && state.budgets.some(b => b.category === t.category))
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const overallUsedPercent = totalBudgeted > 0 ? Math.min((totalBudgetSpent / totalBudgeted) * 100, 100) : 0;

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

  // Generate Dynamic Insight Tip
  let dynamicTip = {
    title: "Student Tip",
    message: "Log your daily expenses consistently to get personalized insights on your spending habits!",
    action: "Explore Financial Guides →",
    color: "#159a83"
  };

  const getHighestExpense = () => {
    const categorySpend = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
        return acc;
      }, {});
    
    let maxCat = '';
    let maxVal = 0;
    for (const [cat, val] of Object.entries(categorySpend)) {
      if (val > maxVal) { maxVal = val; maxCat = cat; }
    }
    return { cat: maxCat, val: maxVal };
  };

  const highestExpense = getHighestExpense();

  const overBudget = state.budgets.find(b => {
    const spent = state.transactions.filter(t => t.type === 'expense' && t.category === b.category).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return (spent / b.limit) >= 1;
  });

  const approachingBudget = state.budgets.find(b => {
    const spent = state.transactions.filter(t => t.type === 'expense' && t.category === b.category).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return (spent / b.limit) >= 0.8 && (spent / b.limit) < 1;
  });

  if (overBudget) {
    dynamicTip = {
      title: "Budget Exceeded",
      message: `You've exceeded your ${overBudget.category} budget! Try cutting back on non-essentials for the rest of the month.`,
      action: "Review Budgets →",
      color: "#e11d48"
    };
  } else if (approachingBudget) {
    const spent = state.transactions.filter(t => t.type === 'expense' && t.category === approachingBudget.category).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const percent = Math.round((spent / approachingBudget.limit) * 100);
    dynamicTip = {
      title: "Budget Warning",
      message: `Watch out! You've used ${percent}% of your ${approachingBudget.category} budget. Pace yourself to avoid hitting your GH¢${approachingBudget.limit.toFixed(2)} limit.`,
      action: "Review Budgets →",
      color: "#f5a623"
    };
  } else if (highestExpense.val > 0) {
    dynamicTip = {
      title: "Spending Insight",
      message: `Your highest expense this month is ${highestExpense.cat} at GH¢${highestExpense.val.toFixed(2)}. Look for student discounts or alternatives to save money!`,
      action: "Find Student Discounts →",
      color: "#1d4ed8"
    };
  } else if (totalBalance > 0) {
    dynamicTip = {
      title: "Savings Opportunity",
      message: `Great job keeping expenses low! Consider moving a portion of your GH¢${totalBalance.toFixed(2)} available balance into a dedicated savings bucket.`,
      action: "Set up Savings →",
      color: "#159a83"
    };
  }

  return (
    <div className="page-wrapper">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-page-title">Portfolio Overview</h1>
          <p className="dashboard-page-subtitle">Welcome back, your spending tracks are updated.</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Notifications"><Bell size={20} /></button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{marginRight: '8px'}}/> Save Expenses
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="grid-left">
          
          {/* Main Balance Card */}
          <div className="balance-card">
            <p className="card-label">Total Available Balance</p>
            <h2 className="card-balance">GH¢{totalBalance.toFixed(2)}</h2>
            
            <div className="balance-stats">
              <div>
                <p className="stat-label">MONTHLY INCOME</p>
                <p className="stat-value">GH¢{totalIncome.toFixed(2)}</p>
              </div>
              <div>
                <p className="stat-label">TOTAL EXPENSES</p>
                <p className="stat-value">GH¢{totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="section-header">
            <h3>Recent Activity</h3>
            <NavLink to="/dashboard/wallets" className="btn-link" style={{textDecoration: 'none'}}>See Statement</NavLink>
          </div>
          
          <div className="activity-list">
            {recentTransactions.length === 0 ? (
              <p style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>No recent activity.</p>
            ) : (
              recentTransactions.map(t => {
                const config = getCategoryConfig(t.category, t.type);
                return (
                  <ActivityItem 
                    key={t.id}
                    icon={config.icon} 
                    iconBg={config.bg}
                    title={t.title} 
                    subtitle={`${t.category} • ${new Date(t.date).toLocaleDateString()}`} 
                    amount={t.type === 'transfer' ? `GH¢${parseFloat(t.amount).toFixed(2)}` : `${t.type === 'income' ? '+' : '-'}GH¢${parseFloat(t.amount).toFixed(2)}`} 
                    type={t.type} 
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="grid-right">
          
          {/* Monthly Budget */}
          <div className="widget-card">
            <div className="widget-header">
              <h3>Monthly Budget</h3>
              {totalBudgeted > 0 && <span className="badge">{Math.round(overallUsedPercent)}%</span>}
            </div>
            <div className="budget-bars">
              {topBudgets.length === 0 ? (
                <p style={{fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0'}}>
                  No active budgets.
                </p>
              ) : (
                topBudgets.map(b => {
                  const spent = state.transactions
                    .filter(t => t.type === 'expense' && t.category === b.category)
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                  
                  let color = '#455a64';
                  if (b.category.includes('Food')) color = '#f5a623';
                  else if (b.category.includes('Transport')) color = '#19b69b';

                  return (
                    <BudgetBar 
                      key={b.id} 
                      label={b.category.toUpperCase()} 
                      spent={spent.toFixed(2)} 
                      total={b.limit.toFixed(2)} 
                      color={color} 
                    />
                  );
                })
              )}
            </div>
            <NavLink to="/dashboard/budget" className="btn-link w-full text-center mt-16" style={{display: 'block', textDecoration: 'none'}}>
              Manage Budgets
            </NavLink>
          </div>

          {/* Dynamic Insight Tip */}
          <div className="tip-card" style={{marginTop: '24px', borderLeft: `4px solid ${dynamicTip.color}`}}>
            <div className="tip-icon" style={{backgroundColor: `${dynamicTip.color}20`}}><Lightbulb size={20} color={dynamicTip.color}/></div>
            <h4 style={{color: dynamicTip.color}}>{dynamicTip.title}</h4>
            <p>{dynamicTip.message}</p>
            <button className="btn-link" style={{color: dynamicTip.color}}>{dynamicTip.action}</button>
          </div>

        </div>
      </div>
      
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

// Subcomponents
const ActivityItem = ({ icon, iconBg, title, subtitle, amount, type }) => (
  <div className="activity-item">
    <div className="activity-icon" style={{ backgroundColor: iconBg }}>{icon}</div>
    <div className="activity-details">
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </div>
    <div className={`activity-amount ${type}`}>{amount}</div>
  </div>
);

const BudgetBar = ({ label, spent, total, color }) => {
  const percent = Math.min((spent / total) * 100, 100);
  return (
    <div className="budget-bar-container">
      <div className="budget-bar-header">
        <span className="budget-label">{label}</span>
        <span className="budget-values">GH¢{spent} / GH¢{total}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
};

export default Home;
