// utils.ts

import { Transaction } from "../data/types";
import { toast } from "react-toastify";

// Get data from localStorage
export const getLocalData = (key: string): any => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Set data to localStorage
export const setLocalData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Calculate totals
export const calculateTotals = (txns: Transaction[]) => {
  let income = 0, expense = 0, savings = 0;

  txns.forEach((t) => {
    const amt = parseFloat(t.amount);
    if (t.type === "Income") income += amt;
    else if (t.type === "Expense") expense += amt;
    else if (t.type === "Savings") savings += amt;
  });

  return {
    income,
    expense,
    savings,
    balance: income - expense - savings,
  };
};

export const showSuccess = (message: string, toastId?: string) => {
  toast.success(message, {
    position: "top-center",
    toastId,
    autoClose: 3000,
  });
};

export const showError = (message: string, toastId?: string) => {
  toast.error(message, {
    position: "top-center",
    toastId,
    autoClose: 3000,
  });
};

export function smallLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-gray-300 rounded-full border-t-purple-500 animate-spin" />
    </div>
  );
}