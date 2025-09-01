"use client";
import React, { useState } from "react";
import DropDown from "./Reusables/DropDown";
import DatePickerComponent from "./Reusables/DatePicker";
import { TransactionFormProps } from "../data/types";
import { useTrans } from "../context/DataContext";
import { showError, showSuccess, setLocalData, getLocalData } from "./utils";

export default function TransactionForm({
  initialValues = { amount: "", type: "", date: null, category: "" },
  mode,
  onSubmit,
}: TransactionFormProps) {
  const [formData, setFormData] = useState(() => initialValues);
  const { totals } = useTrans();
  if (!totals) return null;

  const isFormInvalid =
    !formData.amount || !formData.type || !formData.date || !formData.category;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    let income = totals.income || 0;
    let expense = totals.expense || 0;
    let saving = totals.savings || 0;
    let balance = income - (expense + saving);

    const newAmount = parseFloat(formData.amount);
    if (newAmount <= 0) {
      showError("Add valid amount", "add-valid-income");
      return;
    }

    const originalAmount = parseFloat(initialValues.amount || "0");

    // add mode

    if (mode !== "edit") {
      if (formData.type === "Expense" || formData.type === "Savings") {
        if (income === 0) {
          showError("Insufficient balance", "add-no-income");
          return;
        }

        const recalculatedBalance = income - (expense + saving);

        if (recalculatedBalance < 0) {
          showError("Insufficient balance", "add-no-balance");
          return;
        }

        if (newAmount > recalculatedBalance) {
          showError("Insufficient balance", "add-exceeds-balance");
          return;
        }
      }
    }

    if (mode === "edit") {
      let updatedIncome = income;
      let updatedExpense = expense;
      let updatedSaving = saving;
      if (initialValues.type === "Income") updatedIncome -= originalAmount;
      if (initialValues.type === "Expense") updatedExpense -= originalAmount;
      if (initialValues.type === "Savings") updatedSaving -= originalAmount;
      if (formData.type === "Income") updatedIncome += newAmount;
      if (formData.type === "Expense") updatedExpense += newAmount;
      if (formData.type === "Savings") updatedSaving += newAmount;

      const newBalance = updatedIncome - (updatedExpense + updatedSaving);
      if (updatedIncome < 0 || newBalance < 0) {
        showError("Insufficient balance to update", "update-error");
        return;
      }

      if (updatedExpense + updatedSaving > updatedIncome) {
        showError("Insufficient balance to update", "update-error");
        return;
      }
    }

    const toastId = "transaction-toast";
    const message =
      mode === "edit" ? "Transaction Updated" : "Transaction Added";
    showSuccess(message, toastId);

    setTimeout(() => {
      onSubmit(formData);
    }, 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm px-10 py-12 bg-white shadow-lg rounded-2xl"
    >
      <h1 className="mb-6 text-3xl font-semibold text-center">
        {mode === "edit" ? "Edit Transaction" : "Add Transaction"}
      </h1>

      {/* Date Picker */}
      <div className="mb-5">
        <label className="block mb-2 text-base font-bold text-gray-700">
          Date
        </label>
        <DatePickerComponent
          placeholder="Select date"
          selectedDate={formData.date ? new Date(formData.date) : null}
          onChangeDate={(date) =>
            setFormData({
              ...formData,
              date: date ? date.toLocaleDateString("en-CA") : null,
            })
          }
        />
      </div>

      {/* Type Dropdown */}
      <div className="mb-5">
        <label className="block text-base font-bold text-gray-700">Type</label>
        <DropDown
          options={["Income", "Expense", "Savings"]}
          value={formData.type}
          placeholder="Select type"
          onSelect={(value) => setFormData({ ...formData, type: value })}
        />
      </div>

      {/* Category Dropdown */}
      <div className="mb-5">
        <label className="block text-base font-bold text-gray-700">
          Category
        </label>
        <DropDown
          options={
            formData.type === "Income"
              ? ["Salary", "Freelance", "Bonus", "Investment", "Rental"]
              : formData.type === "Expense"
              ? ["Rent", "Groceries", "Bills", "Travel", "Shopping"]
              : formData.type === "Savings"
              ? ["Emergency Fund", "Mutual Fund", "Bank Deposit", "Retirement"]
              : []
          }
          value={formData.category}
          placeholder="Select category"
          disabled={!formData.type}
          onSelect={(value) => setFormData({ ...formData, category: value })}
        />
      </div>

      {/* Amount Input */}
      <div className="mb-5">
        <label className="block text-base font-bold text-gray-700">
          Amount
        </label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          onWheel={(e) => e.currentTarget.blur()}
          placeholder="Enter amount"
          className="w-full px-4 py-3 mt-2 text-sm placeholder-gray-800 border border-gray-300 rounded-lg focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isFormInvalid}
        className={`text-base font-medium w-full py-2 rounded-lg transition duration-300 ${
          isFormInvalid
            ? "bg-purple-500 text-white cursor-not-allowed"
            : "bg-purple-500 text-white hover:bg-purple-600 cursor-pointer"
        }`}
      >
        {mode === "edit" ? "Save Changes" : "Add Details"}
      </button>
    </form>
  );
}
