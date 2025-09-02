"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  AuthContextType,
  Transaction,
  TransContextType,
} from "../data/types";

import {
  getLocalData,
  setLocalData,
  calculateTotals,
} from "@/app/components/utils";

// --- Auth Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// --- Transaction Context ---
const TransContext = createContext<TransContextType | undefined>(undefined);

export const TransProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState({
    income: 0,
    expense: 0,
    savings: 0,
    balance: 0,
  });

  useEffect(() => {
    if (user?.email) {
      const allTransactions = getLocalData("TransactionData");
      const userTxns = allTransactions ? (allTransactions[user.email]) : [];
      setTransactions(userTxns);
      updateAndStoreTotals(user.email, userTxns);
    }
  }, [user]);

  // Calculate and store totals
  const updateAndStoreTotals = (email: string, txns: Transaction[]) => {
    const newTotals = calculateTotals(txns);
    setTotals(newTotals);
    setLocalData(`Totals-${email}`, newTotals);
  };

  //  Add Transaction

  const addTransaction = (txn: Transaction) => {
    if (!user?.email) return;

    const allTxns = getLocalData("TransactionData") || {};
    const newTxn = { ...txn, createdAt: new Date().toISOString() };
    const updatedTxns = {
      ...allTxns,
      [user.email]: [...(allTxns[user.email] || []), newTxn],
    };

    setLocalData("TransactionData", updatedTxns);
    setTransactions(updatedTxns[user.email]);
    updateAndStoreTotals(user.email, updatedTxns[user.email]);
  };

  // Delete Transaction
  const deleteTransaction = (index: number): boolean => {
    if (!user?.email) return false;

    const allTransactions = getLocalData("TransactionData") || {};
    const userTxns = allTransactions[user.email] || [];
    const txnToDelete = userTxns[index];
    const amount = parseFloat(txnToDelete.amount);
    const totals = getLocalData(`Totals-${user.email}`) || {};

    if (txnToDelete.type === "Income") {
      const valueToDelete = amount;
      const totalIncome = parseFloat(totals.income) || 0;
      const totalExpense = parseFloat(totals.expense) || 0;
      const totalSaving = parseFloat(totals.savings) || 0;

      const incomeAfterDelete = totalIncome - valueToDelete;

      if (incomeAfterDelete < totalExpense + totalSaving) {
        return false;
      }
    }

    const updatedList = userTxns.filter((_txn: any, i: number) => i !== index);
    allTransactions[user.email] = updatedList;
    setLocalData("TransactionData", allTransactions);
    setTransactions(updatedList);
    updateAndStoreTotals(user.email, updatedList);

    return true;
  };

  //  Edit Transaction
  const editTransaction = (index: number, updatedTxn: Transaction) => {
    if (!user?.email) return;

    const allTransactions = getLocalData("TransactionData") || "{}";
    const userTxns = [...(allTransactions[user.email] || [])];
    userTxns[index] = {
      ...updatedTxn,
      createdAt: new Date().toISOString(),
    };

    const updatedData = { ...allTransactions, [user.email]: userTxns };
    setLocalData("TransactionData", updatedData);
    setTransactions(userTxns);
    updateAndStoreTotals(user.email, userTxns);
  };

  return (
    <TransContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        editTransaction,
        totals,
      }}
    >
      {children}
    </TransContext.Provider>
  );
};

export const useTrans = () => {
  const context = useContext(TransContext);
  if (!context) throw new Error("useTrans must be used within a TransProvider");
  return context;
};
