import React from "react";
import { ProgressBarProps } from "../data/types";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function ProgressBar({
  totalIncome,
  totalExpense,
  totalSaving,
}: ProgressBarProps) {
  const expensePercent =
    totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const savingPercent = totalIncome > 0 ? (totalSaving / totalIncome) * 100 : 0;
  const usedPercent = expensePercent + savingPercent;
  const balancePercent = 100 - usedPercent;

  return (
    <div className="relative w-full">
      <h2 className="mb-2 text-sm font-medium text-gray-700">
        Income Distribution
      </h2>
      <div className="relative w-full h-2 overflow-hidden bg-gray-200 rounded-full">
        {/* Expense bar */}
        <div
          className="absolute left-0 h-full bg-red-500 cursor-pointer"
          data-tooltip-id="tooltip"
          data-tooltip-content={`Expense: ${expensePercent.toFixed(1)}%`}
          style={{ width: `${expensePercent}%` }}
        />

        {/* Saving bar */}
        <div
          className="absolute h-full bg-blue-500 cursor-pointer"
          data-tooltip-id="tooltip"
          data-tooltip-content={`Saving: ${savingPercent.toFixed(1)}%`}
          style={{ left: `${expensePercent}%`, width: `${savingPercent}%` }}
        />

        {/* Balance bar */}
        <div
          className="absolute h-full bg-gray-200 cursor-pointer"
          data-tooltip-id="tooltip"
          data-tooltip-content={`Balance: ${balancePercent.toFixed(1)}%`}
          style={{
            left: `${usedPercent}%`,
            width: `${balancePercent}%`,
          }}
        />
      </div>
      <Tooltip
        id="tooltip"
        place="top"
        className="!py-1 !px-2 !rounded-md !shadow-lg z-50 !text-sm  !text-center"
      />
    </div>
  );
}
