import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function IncomePieChart({
  totalIncome,
  totalExpense,
  totalSaving,
}: {
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
}) {
  const expensePercent =
    totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const savingPercent = totalIncome > 0 ? (totalSaving / totalIncome) * 100 : 0;
  const usedPercent = expensePercent + savingPercent;
  const balancePercent = 100 - usedPercent;

  const values = [expensePercent, savingPercent, balancePercent];
  const labels = ["Expense", "Savings", "Balance"];
  const colors = [
    "rgba(239, 68, 68, 0.8)", // red-500
    "rgba(59, 130, 246, 0.8)", // blue-500
    "rgba(209, 213, 219, 0.8)", // gray-500
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Income Distribution",
        data: values,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw as number;
          return `${context.label}: ${value.toFixed(1)}%`;
        },
      },
    },
    legend: {
      position: "right",
      align: "center",
      labels: {
        boxWidth: 10,
        padding: 10,
      },
      onHover: (event) => {
        const canvas = event?.native?.target as HTMLCanvasElement | null;
        if (canvas) {
          canvas.style.cursor = "pointer";
        }
      },
      onLeave: (event) => {
        const canvas = event?.native?.target as HTMLCanvasElement | null;
        if (canvas) {
          canvas.style.cursor = "default";
        }
      },
    },
  },
  onHover: (event, chartElement) => {
    const canvas = event?.native?.target as HTMLCanvasElement | null;
    if (canvas) {
      canvas.style.cursor = chartElement.length ? "pointer" : "default";
    }
  },
};


  return <Pie data={data} options={options} />;
}
