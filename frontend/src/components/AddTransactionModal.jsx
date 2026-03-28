import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import Button from './Button';
import Input from './Input';

function AddTransactionModal({ isOpen, onClose }) {
  const { state, addTransaction } = useExpense();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food & Drinks',
    walletId: state.wallets.length > 0 ? state.wallets[0].id : ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.walletId) return alert('Please add a wallet first from the Wallets page.');
    if (!formData.title || !formData.amount) return alert('Please fill in all fields.');
    
    addTransaction(formData);
    
    // Reset and close
    setFormData({ ...formData, title: '', amount: '' });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button onClick={onClose} className="close-btn"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-container">
            <label className="input-label">Transaction Type</label>
            <select 
              className="input-field" 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="input-container">
            <label className="input-label">Wallet / Account</label>
            <select className="input-field" value={formData.walletId} onChange={e => setFormData({...formData, walletId: e.target.value})} required>
                <option value="">Select an account</option>
                {state.wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name} (GH¢{w.balance.toFixed(2)})</option>
                ))}
              </select>
          </div>

          <Input 
            id="title" 
            label="Title / Description" 
            type="text" 
            placeholder="e.g. Coffee at Library"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          
          <Input 
            id="amount" 
            label="Amount (GH¢)" 
            type="number" 
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})}
          />

          <div className="input-container">
            <label className="input-label">Category</label>
            <select 
              className="input-field" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="Food & Drinks">Food & Drinks</option>
              <option value="Transport">Transport</option>
              <option value="Learning Materials">Learning Materials</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Income">Income</option>
            </select>
          </div>

          <div className="mt-16">
            <Button variant="primary" type="submit">Save Transaction</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;
