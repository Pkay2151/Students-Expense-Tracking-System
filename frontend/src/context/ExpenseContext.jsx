import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '../utils/api';

const initialState = {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadExpenseState = useCallback(async () => {
    if (!currentUser) {
      dispatch({ type: 'SET_STATE', payload: initialState });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const [wallets, transactions, budgets] = await Promise.all([
        apiRequest('/wallets', { user: currentUser }),
        apiRequest('/transactions', { user: currentUser }),
        apiRequest('/budgets', { user: currentUser }),
      ]);

      dispatch({
        type: 'SET_STATE',
        payload: {
          wallets: Array.isArray(wallets) ? wallets : [],
          transactions: Array.isArray(transactions) ? transactions : [],
          budgets: Array.isArray(budgets) ? budgets : [],
        },
      });
    } catch (loadError) {
      setError(loadError.message || 'Failed to load data from server');
      dispatch({ type: 'SET_STATE', payload: initialState });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadExpenseState();
  }, [loadExpenseState]);

  const addWallet = async (wallet) => {
    if (!currentUser) throw new Error('You must be logged in');

    const createdWallet = await apiRequest('/wallets', {
      user: currentUser,
      method: 'POST',
      body: {
        name: wallet.name,
        type: wallet.type,
        balance: parseFloat(wallet.balance) || 0,
      },
    });

    dispatch({ type: 'ADD_WALLET', payload: createdWallet });
    return createdWallet;
  };

  const addTransaction = async (transaction) => {
    if (!currentUser) throw new Error('You must be logged in');

    const createdTransaction = await apiRequest('/transactions', {
      user: currentUser,
      method: 'POST',
      body: {
        title: transaction.title,
        amount: parseFloat(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        walletId: transaction.walletId,
      },
    });

    dispatch({ type: 'ADD_TRANSACTION', payload: createdTransaction });
    return createdTransaction;
  };

  const addBudget = async (budget) => {
    if (!currentUser) throw new Error('You must be logged in');

    const savedBudget = await apiRequest('/budgets', {
      user: currentUser,
      method: 'POST',
      body: {
        category: budget.category,
        limit: parseFloat(budget.limit),
        threshold: parseFloat(budget.threshold),
      },
    });

    dispatch({ type: 'ADD_BUDGET', payload: savedBudget });
    return savedBudget;
  };

  const transferFunds = async (transferData) => {
    if (!currentUser) throw new Error('You must be logged in');

    const createdTransfer = await apiRequest('/transactions/transfer', {
      user: currentUser,
      method: 'POST',
      body: {
        sourceWalletId: transferData.sourceWalletId,
        targetWalletId: transferData.targetWalletId,
        amount: parseFloat(transferData.amount),
        title: transferData.title,
      },
    });

    dispatch({
      type: 'TRANSFER_FUNDS',
      payload: {
        sourceWalletId: transferData.sourceWalletId,
        targetWalletId: transferData.targetWalletId,
        amount: parseFloat(transferData.amount),
        title: transferData.title,
        id: createdTransfer.id,
        date: createdTransfer.date,
      },
    });

    return createdTransfer;
  };

  return (
    <ExpenseContext.Provider
      value={{
        state,
        isLoading,
        error,
        refresh: loadExpenseState,
        addWallet,
        addTransaction,
        addBudget,
        transferFunds,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => useContext(ExpenseContext);
