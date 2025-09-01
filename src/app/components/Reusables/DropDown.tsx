"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownProps } from "../../data/types";

export default function DropDown({
  options,
  value,
  placeholder,
  onSelect,
  className = "",
  disabled = false,
}: DropdownProps) {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => {
          if (!disabled) setShowOptions((prev) => !prev);
        }}
        className={`flex items-center justify-between w-full px-4 py-3 transition border rounded-lg 
          ${
            disabled
              ? "cursor-not-allowed border-gray-200"
              : "bg-white border-gray-300 cursor-pointer"
          } 
          ${className}`}
      >
        <span className="text-sm">
          {value || placeholder || "Select option"}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>

      {showOptions && !disabled && (
        <ul className="absolute w-full min-w-[100px] mt-1 bg-white border border-gray-300 rounded-md shadow-md z-20 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onSelect(option);
                setShowOptions(false);
              }}
              className="px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-purple-100"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
