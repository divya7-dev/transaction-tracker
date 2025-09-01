import { useTrans } from "@/app/context/DataContext";
import PieChart from "./Reusables/PieChart";
import { useEffect, useState } from "react";

export default function ChartsPage() {
  const { transactions } = useTrans();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-2 mt-5 border-t border-gray-300">
      <div>
        <h2 className="w-full max-w-lg my-4 text-2xl font-semibold ">
          Transaction Overview By Category
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          <div
            className="py-2 rounded-xl"
            style={{
              boxShadow:
                "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
            }}
          >
            <PieChart
              transactions={transactions}
              type="Income"
              isLoading={isLoading}
            />
          </div>
          <div
            className="py-2 rounded-xl"
            style={{
              boxShadow:
                "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
            }}
          >
            <PieChart
              transactions={transactions}
              type="Expense"
              isLoading={isLoading}
            />
          </div>
          <div
            className="py-2 rounded-xl"
            style={{
              boxShadow:
                "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
            }}
          >
            <PieChart
              transactions={transactions}
              type="Savings"
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
