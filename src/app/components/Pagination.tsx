import React from "react";
import { ChevronLeft,ChevronRight } from "lucide-react";
import { PaginationProps } from "../data/types";
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const generatePages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 3) {
      // Small number of pages, show all
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first
      pages.push(1);

      // Show left dots
      if (currentPage > 3) pages.push("...");

      // currentPage - 1, currentPage, currentPage + 1
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      // right dots
      if (currentPage < totalPages - 2) pages.push("...");

      // Always show last
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex justify-end mt-4 space-x-1 text-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border border-gray-400 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 "
            : "bg-white hover:bg-gray-100 cursor-pointer"
        }`}
      >
        <ChevronLeft size={12}/>
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-1 text-gray-500 select-none">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md border ${
              page === currentPage
                ? "bg-purple-500 text-white cursor-pointer border-none"
                : "bg-white hover:bg-gray-100 cursor-pointer border-gray-400"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md border border-gray-400 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 "
            : "bg-white hover:bg-gray-100 cursor-pointer "
        }`}
      >
        <ChevronRight size={12}/>
      </button>
    </div>
  );
}
