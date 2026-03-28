import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import Button from './Button';
import Input from './Input';

function AddWalletModal({ isOpen, onClose }) {
  const { addWallet } = useExpense();
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    balance: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return alert('Name is required');
    addWallet(formData);
    
    // Reset and close
    setFormData({ name: '', type: 'bank', balance: '' });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Account</h2>
          <button onClick={onClose} className="close-btn"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <Input 
            id="name" 
            label="Account Name" 
            type="text" 
            placeholder="e.g. Chase Checkings"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          
          <div className="input-container">
            <label className="input-label">Account Type</label>
            <select 
              className="input-field" 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="bank">Bank Account</option>
              <option value="mobile">Mobile Money</option>
              <option value="cash">Physical Cash</option>
            </select>
          </div>

          <Input 
            id="balance" 
            label="Initial Balance (GH¢)" 
            type="number" 
            step="0.01"
            placeholder="0.00"
            value={formData.balance}
            onChange={e => setFormData({...formData, balance: e.target.value})}
          />

          <div className="mt-16">
            <Button variant="primary" type="submit">Create Account</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWalletModal;
