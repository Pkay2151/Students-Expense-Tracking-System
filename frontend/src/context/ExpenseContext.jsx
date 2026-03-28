import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const initialState = {
  // Empty state as requested by the user
  wallets: [],
  transactions: [],
  budgets: []
};

const ExpenseContext = createContext();

function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'ADD_WALLET':
      return { ...state, wallets: [...state.wallets, action.payload] };
    
    case 'ADD_TRANSACTION': {
      // Adjust wallet balance accordingly
      const updatedWallets = state.wallets.map(w => {
        if (w.id === action.payload.walletId) {
          const amount = parseFloat(action.payload.amount);
          return {
            ...w,
            balance: action.payload.type === 'income' ? w.balance + amount : w.balance - amount
          };
        }
        return w;
      });
      
      return {
        ...state,
        wallets: updatedWallets,
        transactions: [action.payload, ...state.transactions]
      };
    }
    
    case 'TRANSFER_FUNDS': {
      const { sourceWalletId, targetWalletId, amount, title } = action.payload;
      const transferAmt = parseFloat(amount);

      const updatedWallets = state.wallets.map(w => {
        if (w.id === sourceWalletId) return { ...w, balance: w.balance - transferAmt };
        if (w.id === targetWalletId) return { ...w, balance: w.balance + transferAmt };
        return w;
      });

      const transferTx = {
        id: Date.now().toString(),
        type: 'transfer',
        title: title || 'Wallet Transfer',
        category: 'Transfer',
        amount: transferAmt,
        sourceWalletId,
        targetWalletId,
        walletId: sourceWalletId, 
        date: new Date().toISOString()
      };

      return {
        ...state,
        wallets: updatedWallets,
        transactions: [transferTx, ...state.transactions]
      };
    }
    
    case 'ADD_BUDGET':
      // Prevent duplicate categories
      const exists = state.budgets.find(b => b.category === action.payload.category);
      if (exists) {
        return {
          ...state,
          budgets: state.budgets.map(b => b.category === action.payload.category ? { ...b, ...action.payload } : b)
        };
      }
      return { ...state, budgets: [...state.budgets, action.payload] };
      
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const { currentUser } = useAuth();
  
  // Flag to prevent 'initialState' overwriting valid localStorage data on hard refresh
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user data on mount / login
  useEffect(() => {
    setIsLoaded(false); // Lock saving until explicitly loaded
    if (currentUser) {
      const savedData = localStorage.getItem(`expenses_${currentUser.uid}`);
      if (savedData) {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(savedData) });
      } else {
        dispatch({ type: 'SET_STATE', payload: initialState });
      }
    } else {
      dispatch({ type: 'SET_STATE', payload: initialState });
    }
    setIsLoaded(true); // Unlock saving
  }, [currentUser]);

  // Save user data on state change
  useEffect(() => {
    if (isLoaded && currentUser) {
      localStorage.setItem(`expenses_${currentUser.uid}`, JSON.stringify(state));
    }
  }, [state, currentUser, isLoaded]);

  // Helper actions
  const addWallet = (wallet) => dispatch({ 
    type: 'ADD_WALLET', 
    payload: { 
      ...wallet, 
      id: Date.now().toString(), 
      balance: parseFloat(wallet.balance) || 0 
    } 
  });
  
  const addTransaction = (transaction) => dispatch({ 
    type: 'ADD_TRANSACTION', 
    payload: { 
      ...transaction, 
      id: Date.now().toString(), 
      date: new Date().toISOString() 
    } 
  });
  
  const addBudget = (budget) => dispatch({ 
    type: 'ADD_BUDGET', 
    payload: { 
      ...budget, 
      id: Date.now().toString() 
    } 
  });

  const transferFunds = (transferData) => dispatch({
    type: 'TRANSFER_FUNDS',
    payload: transferData
  });

  return (
    <ExpenseContext.Provider value={{ state, addWallet, addTransaction, addBudget, transferFunds }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => useContext(ExpenseContext);
