import React, { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";
import DropDown from "./Reusables/DropDown";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { FilterUiProps } from "../data/types";

export default function FilterComponent({
  transactions,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
}: FilterUiProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categoryOptions =
    selectedType !== "All"
      ? Array.from(
          new Set(
            transactions
              .filter((txn) => txn.type === selectedType)
              .map((txn) => txn.category)
          )
        )
      : [];

  return (
    <div className="relative inline-block" ref={filterRef}>
      <button
        data-tooltip-id="tooltip"
        data-tooltip-content="Filter"
        onClick={() => setShowFilterPanel((prev) => !prev)}
        className="btn-primary"
      >
        <Filter size={18} />
      </button>

      {showFilterPanel && (
        <div className="absolute z-50 mt-2 flex gap-4 bg-white rounded-md shadow-md p-3 w-[400px] right-1">
          <DropDown
            options={["All", "Income", "Expense", "Savings"]}
            value={selectedType}
            placeholder="All"
            onSelect={(val) => {
              setSelectedType(val);
              setSelectedCategory("All");
            }}
            className="w-1/2"
          />
          <DropDown
            options={
              selectedType !== "All" ? ["All", ...categoryOptions] : ["All"]
            }
            value={selectedCategory}
            placeholder="All"
            disabled={false}
            onSelect={(val) => {
              setSelectedCategory(val);
              setShowFilterPanel(false);
            }}
            className="w-1/2"
          />
        </div>
      )}

      <Tooltip
        id="tooltip"
        place="top"
        className="!text-xs !py-1 !px-2 !rounded-md !shadow-lg z-50"
      />
    </div>
  );
}
