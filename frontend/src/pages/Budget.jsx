import React, { useState } from 'react';
import { Plus, Target, AlertCircle } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import Button from '../components/Button';
import Input from '../components/Input';
import './Dashboard.css';

function Budget() {
  const { state, addBudget } = useExpense();
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    threshold: 80
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.limit) return alert("Please select a category and limit");
    addBudget({
      ...formData,
      limit: parseFloat(formData.limit),
      threshold: parseFloat(formData.threshold)
    });
    setFormData({ category: '', limit: '', threshold: 80 });
  };

  const totalBudgeted = state.budgets.reduce((sum, b) => sum + b.limit, 0);
  
  // Total Spent overall this month (simplified to all expenses for now)
  const totalSpent = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const overallUsedPercent = totalBudgeted > 0 ? Math.min((totalSpent / totalBudgeted) * 100, 100) : 0;

  return (
    <div className="page-wrapper">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-page-title">Monthly Budgets</h1>
          <p className="dashboard-page-subtitle">Set targets and track your spending limits.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary btn-sm" style={{borderRadius: '24px'}} onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
            <Plus size={18} style={{marginRight: '8px'}}/> New Budget
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Left Column: Active Budgets */}
        <div className="grid-left">
          
          <div className="wallets-cards-grid" style={{gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px', marginBottom: '32px'}}>
            <div className="wallet-card dark" style={{minHeight: '140px', padding: '24px', justifyContent: 'center'}}>
              <h4 style={{fontSize: '12px', fontWeight: 600, opacity: 0.8, marginBottom: '8px'}}>TOTAL BUDGETED</h4>
              <h2 className="wallet-card-balance" style={{fontSize: '32px'}}>GH¢{totalBudgeted.toFixed(2)}</h2>
            </div>
            <div className="wallet-card light" style={{minHeight: '140px', padding: '24px', borderColor: 'var(--border-color)', justifyContent: 'center'}}>
              <h4 style={{fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px'}}>TOTAL SPENT</h4>
              <h2 className="wallet-card-balance" style={{fontSize: '32px', color: 'var(--text-main)'}}>GH¢{totalSpent.toFixed(2)}</h2>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px'}}>
                 <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: overallUsedPercent > 80 ? '#e11d48' : '#19b69b'}}></div>
                 <p style={{fontSize: '12px', color: overallUsedPercent > 80 ? '#e11d48' : '#19b69b', fontWeight: 600}}>{overallUsedPercent.toFixed(1)}% Used</p>
              </div>
            </div>
          </div>

          <h3 className="section-title">Active Categories</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            
            {state.budgets.length === 0 ? (
              <p style={{textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', color: 'var(--text-muted)'}}>No budgets set. Create one below!</p>
            ) : (
              state.budgets.map(b => {
                // Calculate spent for this specific category
                const categoryTransactions = state.transactions.filter(t => t.type === 'expense' && t.category === b.category);
                const spent = categoryTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const remaining = Math.max(b.limit - spent, 0);
                const percent = Math.min((spent / b.limit) * 100, 100);
                const isOver = percent >= b.threshold;

                let icon = '🎯';
                let iconBg = '#eceff1';
                let colorBar = '#455a64';

                if (b.category.includes('Food')) { icon = '🍴'; iconBg = '#fdeaca'; colorBar = '#f5a623'; }
                else if (b.category.includes('Transport')) { icon = '🚆'; iconBg = '#dff2ec'; colorBar = '#19b69b'; }

                return (
                  <div key={b.id} className="widget-card" style={{padding: '24px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div className="activity-icon" style={{backgroundColor: iconBg, fontSize: '20px', width: '40px', height: '40px', margin: 0}}>
                          <span style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>{icon}</span>
                        </div>
                        <div>
                          <h4 style={{fontSize: '16px', fontWeight: 700}}>{b.category}</h4>
                          <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px'}}>{categoryTransactions.length} transactions this month</p>
                        </div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <h4 style={{fontSize: '16px', fontWeight: 700}}>GH¢{spent.toFixed(2)}</h4>
                        <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px'}}>of GH¢{b.limit.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="progress-track" style={{height: '8px', backgroundColor: '#f0f0f0'}}>
                      <div className="progress-fill" style={{width: `${percent}%`, backgroundColor: isOver ? '#e11d48' : colorBar}}></div>
                    </div>
                    {isOver ? (
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px'}}>
                        <AlertCircle size={14} color="#e11d48"/>
                        <p style={{fontSize: '12px', color: '#e11d48', fontWeight: 600}}>Nearing limit (GH¢{remaining.toFixed(2)} remaining)</p>
                      </div>
                    ) : (
                      <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', fontWeight: 500}}>GH¢{remaining.toFixed(2)} remaining</p>
                    )}
                  </div>
                );
              })
            )}

          </div>
        </div>

        {/* Right Column: Create Budget Form */}
        <div className="grid-right">
          <div className="widget-card" style={{backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: 'none'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
              <div style={{backgroundColor: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '12px'}}>
                <Target size={20} />
              </div>
              <h3 style={{fontSize: '18px', fontWeight: 700}}>Set New Target</h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <label className="input-label">Category Name</label>
                <select 
                  className="input-field" 
                  style={{cursor: 'pointer'}}
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                   <option value="">Select Category...</option>
                   <option value="Food & Drinks">Food & Drinks</option>
                   <option value="Transport">Transport</option>
                   <option value="Learning Materials">Learning Materials</option>
                   <option value="Utilities">Utilities</option>
                   <option value="Entertainment">Entertainment</option>
                </select>
              </div>

              <Input 
                id="limit" 
                label="Monthly Limit (GH¢)" 
                type="number" 
                step="0.01"
                placeholder="e.g. 150.00" 
                value={formData.limit}
                onChange={e => setFormData({...formData, limit: e.target.value})}
              />
              
              <div className="input-container">
                 <label className="input-label">Alert Threshold (%)</label>
                 <Input 
                    id="threshold" 
                    type="number" 
                    placeholder="80" 
                    value={formData.threshold}
                    onChange={e => setFormData({...formData, threshold: e.target.value})}
                 />
                 <span style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', display: 'block'}}>We'll alert you when spending hits this percentage.</span>
              </div>

              <div className="mt-24">
                <Button variant="primary" type="submit">Create Budget</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;
