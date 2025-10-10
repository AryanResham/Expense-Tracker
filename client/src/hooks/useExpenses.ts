import { TransactionsContext } from '../context/TransactionsContext';
import { useContext } from 'react';

// Custom hook for using the transactions context
export const useTransactions = () => {
    const context = useContext(TransactionsContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionsProvider');
    }
    return context;
};