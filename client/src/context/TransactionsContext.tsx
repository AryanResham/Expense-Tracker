import React, { createContext, useState, useEffect, useContext } from "react";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../services/transactions";
import { getSystemCategories, getUserCategories } from "@/services/categories";
import { AuthContext } from "./AuthContext";
import type { Expense } from "../lib/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface TransactionsContextType {
    transactions: Expense[];
    loading: boolean;
    error: string | null;
    categories: any[];
    addTransaction: (transaction: Omit<Expense, 'id'>) => Promise<void>;
    updateTransactionById: (id: string, transaction: Partial<Expense>) => Promise<void>;
    deleteTransactionById: (id: string) => Promise<void>;
    refreshTransactions: () => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsProvider = (props:{ children: React.ReactNode }) => {
    const [transactions, setTransactions] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const authContext = useContext(AuthContext);

    // Fetch transactions when user is authenticated
    useEffect(() => {
        setCategories([]); 
        fetchSystemCategories();
        
        if (authContext?.user) {
            fetchUserCategories();
            refreshTransactions();
        } else {
            // Clear transactions when user logs out
            setTransactions([]);
            setError(null);
        }
        console.log(categories)
    }, [authContext?.user]);

    const fetchUserCategories = async () => {
      if (!authContext?.user) return;
      setLoading(true);
      setError(null);
      try {
        const userCategories = await getUserCategories(); // { success, data: [...] }
        setCategories(prev => [...prev, ...(userCategories?.data ?? [])]); // 👈 FIX
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSystemCategories = async () => {
      try {
        const systemCategories = await getSystemCategories();
        setCategories(prev => [...prev, ...(systemCategories?.data ?? [])]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch system categories');
        console.error('Error fetching system categories:', err);
      }
    };

    const refreshTransactions = async () => {
        if (!authContext?.user) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await getTransactions();
            setTransactions(response.transactions || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch transactions');
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const addTransaction = async (transactionData: Omit<Expense, 'id'>) => {
        if (!authContext?.user) {
            throw new Error('User must be authenticated to add transactions');
        }

        setError(null);
        try {
            const response = await createTransaction(transactionData);
            // Add the new transaction to local state
            setTransactions(prev => [...prev, response.transaction]);
        } catch (err: any) {
            setError(err.message || 'Failed to add transaction');
            throw err;
        }
    };

    const updateTransactionById = async (id: string, transactionData: Partial<Expense>) => {
        if (!authContext?.user) {
            throw new Error('User must be authenticated to update transactions');
        }

        setError(null);
        try {
            const response = await updateTransaction(id, transactionData);
            // Update the transaction in local state
            setTransactions(prev => 
                prev.map(transaction => 
                    transaction.id === id 
                        ? { ...transaction, ...response.transaction }
                        : transaction
                )
            );
        } catch (err: any) {
            setError(err.message || 'Failed to update transaction');
            throw err;
        }
    };

    const deleteTransactionById = async (id: string) => {
        if (!authContext?.user) {
            throw new Error('User must be authenticated to delete transactions');
        }

        setError(null);
        try {
            await deleteTransaction(id);
            // Remove the transaction from local state
            setTransactions(prev => prev.filter(transaction => transaction.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to delete transaction');
            throw err;
        }
    };

    return (
        <TransactionsContext.Provider value={{
            transactions,
            loading,
            error,
            categories,
            addTransaction,
            updateTransactionById,
            deleteTransactionById,
            refreshTransactions
        }}>
        {loading ? <div className="flex items-center justify-center h-dvh"><Spinner variant="circle" className = "text-gray-800"  size = {50}/></div> : props.children}
        </TransactionsContext.Provider>
    );
};

