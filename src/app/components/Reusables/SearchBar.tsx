"use client";
import React from "react";
import { Search } from "lucide-react";
import { SearchBarProps } from "../../data/types";

export default function SearchBar({
  placeholder = "Search by type/category/amount",
  value,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="relative w-70">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full h-10 pl-10 pr-4 text-sm placeholder-gray-800 border border-gray-300 rounded-lg focus:outline-none"
      />
      <Search className="absolute w-5 h-5 text-gray-800 transform -translate-y-1/2 cursor-pointer left-3 top-1/2" />
    </div>
  );
}
