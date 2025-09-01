"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Transaction } from "@/app/data/types";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  transactions: Transaction[];
  type: "Income" | "Expense" | "Savings";
  isLoading: boolean;
};

export default function PieChart({ transactions, type, isLoading }: Props) {
  const filteredTxns = transactions.filter((txn) => txn.type === type);

  const categoryMap: Record<string, number> = {};
  filteredTxns.forEach((txn) => {
    const amount = parseFloat(txn.amount);
    categoryMap[txn.category] = (categoryMap[txn.category] || 0) + amount;
  });

  const labels = Object.keys(categoryMap);
  const dataValues = Object.values(categoryMap);

  const data = {
    labels,
    datasets: [
      {
        label: `${type}`,
        data: dataValues,
        backgroundColor: [
          "#C1CFA1", // base green
          "#E4D6D6", // base pink
          "#CFF3FB", // base blue
          "#CDC1FF", // base lavender
          "#FFB3D4", // base rose
        ],

        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-lg font-semibold text-center">{type}</h2>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="my-2 bg-gray-200 rounded-full w-70 h-70"></div>
        </div>
      ) : labels.length > 0 ? (
        <>
          <Pie
            data={data}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    boxWidth: 20,
                    padding: 15,
                  },
                },
              },
              onHover: (event, chartElement) => {
                const canvas = event?.native?.target as HTMLCanvasElement | null;
                if (canvas) {
                  canvas.style.cursor = chartElement.length ? "pointer" : "default";
                }
              },
            }}
          />
        </>
      ) : (
        <div className="py-10 text-sm text-center text-gray-400">No data available</div>
      )}
    </div>
  );
}
