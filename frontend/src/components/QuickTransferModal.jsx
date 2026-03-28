import React, { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import Button from './Button';
import Input from './Input';

function QuickTransferModal({ isOpen, onClose }) {
  const { state, transferFunds } = useExpense();
  const [formData, setFormData] = useState({
    sourceWalletId: state.wallets.length > 0 ? state.wallets[0].id : '',
    targetWalletId: state.wallets.length > 1 ? state.wallets[1].id : '',
    amount: '',
    title: 'Wallet Transfer'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.sourceWalletId || !formData.targetWalletId) return alert('Select both accounts!');
    if (formData.sourceWalletId === formData.targetWalletId) return alert('Cannot transfer to the same account!');
    if (!formData.amount || parseFloat(formData.amount) <= 0) return alert('Invalid amount!');
    
    const sourceWallet = state.wallets.find(w => w.id === formData.sourceWalletId);
    if (sourceWallet.balance < parseFloat(formData.amount)) return alert('Insufficient funds in source account!');

    transferFunds(formData);
    setFormData({ ...formData, amount: '' });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Quick Transfer</h2>
          <button onClick={onClose} className="close-btn"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-container">
            <label className="input-label">From Account</label>
            <select className="input-field" value={formData.sourceWalletId} onChange={e => setFormData({...formData, sourceWalletId: e.target.value})} required>
                <option value="">Select source</option>
                {state.wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name} (GH¢{w.balance.toFixed(2)})</option>
                ))}
            </select>
          </div>

          <div style={{display: 'flex', justifyContent: 'center', padding: '8px 0'}}>
            <div style={{backgroundColor: '#e2e8f0', borderRadius: '50%', padding: '12px', display: 'flex'}}>
                <ArrowRightLeft size={20} color="var(--text-main)" />
            </div>
          </div>

          <div className="input-container">
            <label className="input-label">To Account</label>
            <select className="input-field" value={formData.targetWalletId} onChange={e => setFormData({...formData, targetWalletId: e.target.value})} required>
                <option value="">Select destination</option>
                {state.wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name} (GH¢{w.balance.toFixed(2)})</option>
                ))}
            </select>
          </div>
          
          <Input 
            id="amount" 
            label="Amount (GH¢)" 
            type="number" 
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})}
          />

          <div className="mt-16">
            <Button variant="primary" type="submit" width="100%">Transfer Funds</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickTransferModal;
