"use client";

import { useState, useEffect, useRef } from "react";
import { useTrans } from "@/app/context/DataContext";
import {
  Trash,
  Pencil,
  Plus,
  Minus,
  Asterisk,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  CirclePower,
  FunnelX,
  X,
} from "lucide-react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { placeholderProps } from "@/app/data/types";
import DateRangePicker from "@/app/components/Reusables/DateRangePicker";
import SearchBar from "@/app/components/Reusables/SearchBar";
import ConfirmModal from "@/app/components/Reusables/ConfirmModal";
import Pagination from "@/app/components/Pagination";
import CsvDownload from "react-csv-downloader";
import Charts from "@/app/components/Charts";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useCookies } from "react-cookie";
import { showSuccess, showError, smallLoader } from "../components/utils";
import { IncomePieChart } from "../components/Reusables/IncomePieChart";
import { startOfDay, endOfDay } from "date-fns";
import FilterComponent from "@/app/components/FilterComponent";
export default function Page({ placeholder }: placeholderProps) {
  const { transactions, deleteTransaction } = useTrans();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [cookies] = useCookies(["name"]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    if (cookies.name) {
      setUsername(cookies.name);
    }
  }, [cookies]);
  const initialQuery = searchParams.get("query")?.toLowerCase() || "";
  const initialSortKey = searchParams.get("sortKey") as
    | keyof (typeof mappedData)[0]
    | null;
  const initialSortOrder = searchParams.get("sortOrder") as
    | "asc"
    | "desc"
    | null;
  const [query, setQuery] = useState(initialQuery);
  const initialFrom = searchParams.get("from");
  const initialTo = searchParams.get("to");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => [
    initialFrom ? new Date(initialFrom) : null,
    initialTo ? new Date(initialTo) : null,
  ]);
  const [fromDate, toDate] = dateRange;
  const initialType = searchParams.get("type") || "";
  const initialCategory = searchParams.get("category") || "";
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof mappedData)[0] | null;
    direction: "asc" | "desc";
  }>({
    key: initialSortKey || null,
    direction: initialSortOrder || "asc",
  });
  // for pagination
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const lastPageIndex = currentPage * rowsPerPage;
  const firstPageIndex = lastPageIndex - rowsPerPage;
  // confirmation & deletion
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  // sort handle
  const handleSort = (key: keyof (typeof paginatedData)[0]) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // search handle
  const handleSearch = (term: string) => {
    setQuery(term.toLowerCase());
    setCurrentPage(1);
  };

  // filtered data
  const filteredTransactions = transactions
    .filter((txn) => {
      const txnDate = new Date(txn.date);
      const matchesQuery =
        txn.category.toLowerCase().includes(query) ||
        txn.type.toLowerCase().includes(query) ||
        txn.amount.toString().includes(query) ||
        txnDate.toLocaleDateString("en-IN").includes(query);
      const matchesType =
        selectedType && selectedType !== "All"
          ? txn.type === selectedType
          : true;
      const matchesCategory =
        selectedCategory && selectedCategory !== "All"
          ? txn.category === selectedCategory
          : true;
      let matchesDate = true;
      if (fromDate && toDate) {
        matchesDate =
          txnDate >= startOfDay(fromDate) && txnDate <= endOfDay(toDate);
      } else if (fromDate && !toDate) {
        matchesDate =
          txnDate >= startOfDay(fromDate) && txnDate <= endOfDay(fromDate);
      }

      return matchesQuery && matchesType && matchesCategory && matchesDate;
    })

    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const totalIncome = transactions
    .filter((txn) => txn.type === "Income")
    .reduce((sum, txn) => sum + Number(txn.amount), 0);

  const totalExpense = transactions
    .filter((txn) => txn.type === "Expense")
    .reduce((sum, txn) => sum + Number(txn.amount), 0);

  const totalSaving = transactions
    .filter((txn) => txn.type === "Savings")
    .reduce((sum, txn) => sum + Number(txn.amount), 0);

  const balance = totalIncome - totalExpense - totalSaving;

  //table data
  const mappedData = filteredTransactions.map((txn) => ({
    rawDate: txn.date,
    rawCreatedAt: txn.createdAt,
    date: new Date(txn.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    category: txn.category,
    type: txn.type,
    amount: txn.amount,
    createdAt: `${new Date(txn.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })} ${new Date(txn.createdAt).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`,
  }));

  type TableData = (typeof mappedData)[number];

  // table data after sort
  const sortedData = [...mappedData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const key = sortConfig.key as keyof TableData;
    const valueA = a[key];
    const valueB = b[key];
    if (key === "amount") {
      const numA = Number(valueA);
      const numB = Number(valueB);
      return sortConfig.direction === "asc" ? numA - numB : numB - numA;
    }
    if (
      typeof valueA === "string" &&
      typeof valueB === "string" &&
      Date.parse(valueA) &&
      Date.parse(valueB)
    ) {
      return sortConfig.direction === "asc"
        ? new Date(valueA).getTime() - new Date(valueB).getTime()
        : new Date(valueB).getTime() - new Date(valueA).getTime();
    }
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return 0;
  });

  //pagination

  const paginatedData = sortedData.slice(firstPageIndex, lastPageIndex);

  // csv download
  const csvColumns = [
    { id: "date", displayName: "Transaction Date" },
    { id: "type", displayName: "Type" },
    { id: "category", displayName: "Category" },
    { id: "amount", displayName: "Amount" },
    { id: "createdAt", displayName: "Created At" },
  ];

  const csvData = filteredTransactions.map((txn) => ({
    date: new Date(txn.date).toLocaleDateString("en-IN"),
    category: txn.category,
    type: txn.type,
    amount: txn.amount,
    createdAt: `"${new Date(txn.createdAt).toLocaleString("en-IN")}"`,
  }));

  // handle email
  const handleEmailShare = () => {
    const subject = "Transaction Details";
    const body = `Please check the transaction data here: ${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  // reset all filters
  const handleFilterReset = () => {
    setQuery("");
    setDateRange([null, null]);
    setSelectedType("");
    setSelectedCategory("");
    setCurrentPage(1);

    const params = new URLSearchParams();
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage) params.set("page", currentPage.toString());
    if (query) params.set("query", query);
    if (fromDate) params.set("from", fromDate.toISOString());
    if (toDate) params.set("to", toDate.toISOString());
    if (selectedType) params.set("type", selectedType);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortConfig.key) params.set("sortKey", sortConfig.key);
    if (sortConfig.direction) params.set("sortOrder", sortConfig.direction);
    if (!fromDate) params.delete("from");
    if (!toDate) params.delete("to");

    replace(`${pathname}?${params.toString()}`);
  }, [
    currentPage,
    query,
    fromDate,
    toDate,
    selectedType,
    selectedCategory,
    sortConfig,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="px-2 mx-10">
        {/* User name */}
        <div className="absolute top-0 right-5 mt-3 mr-5 flex items-center gap-2 z-[100]">
          <h1 className="text-xl font-semibold text-white">
            Welcome,{" "}
            {username && username.charAt(0).toUpperCase() + username.slice(1)}
          </h1>
          <button
            data-ignore-outside
            data-tooltip-id="tooltip"
            data-tooltip-content="Log out"
            className="flex items-center h-10 pr-4 text-sm text-white cursor-pointer"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <CirclePower size={22} />
          </button>
        </div>
        {/* features */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 mt-10">
          <h2 className="text-2xl font-semibold min-w-[150px] flex-1">
            Transaction Overview
          </h2>

          <div className="flex items-center gap-2">
            <SearchBar
              placeholder={placeholder}
              value={query}
              onSearch={handleSearch}
            />

            <DateRangePicker
              dateRange={dateRange}
              setDateRange={(range) => {
                setDateRange(range);
                setCurrentPage(1);
              }}
              showPanel={showPanel}
              setShowPanel={setShowPanel}
            />
            <FilterComponent
              transactions={transactions}
              selectedType={selectedType}
              setSelectedType={(type) => {
                setSelectedType(type);
                setCurrentPage(1);
              }}
              selectedCategory={selectedCategory}
              setSelectedCategory={(category) => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
            />

            <button
              data-ignore-outside
              data-tooltip-id="tooltip"
              data-tooltip-content="Clear Filters"
              onClick={handleFilterReset}
              className="btn-primary"
            >
              <FunnelX size={18} />
            </button>

            <CsvDownload
              filename="transaction_data"
              columns={csvColumns}
              datas={csvData}
            >
              <button
                data-ignore-outside
                data-tooltip-id="tooltip"
                data-tooltip-content="Download CSV"
                className="btn-primary"
              >
                <Download size={18} />
              </button>
            </CsvDownload>
            <button
              data-ignore-outside
              data-tooltip-id="tooltip"
              data-tooltip-content="Share Via Email"
              onClick={handleEmailShare}
              className="btn-primary"
            >
              <Share2 size={18} />
            </button>

            <button
              data-ignore-outside
              data-tooltip-id="tooltip"
              data-tooltip-content="Add Transaction"
              onClick={() => router.push("/transaction/new")}
              className="btn-primary"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        <div className="w-full flex-end">
          {(selectedType !== "All" && selectedType) ||
          (selectedCategory !== "All" && selectedCategory) ? (
            <div className="flex flex-wrap items-center justify-end gap-4 mb-4 ml-auto text-sm text-gray-700">
              <h3 className="text-sm text-gray-800">Applied Filters:</h3>

              {selectedType && selectedType !== "All" && (
                <div className="relative flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-lg">
                  <span>Type: {selectedType}</span>
                  <X
                    size={14}
                    className="text-gray-600 cursor-pointer hover:text-black"
                    onClick={() => {
                      setSelectedType("");
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}

              {selectedCategory && selectedCategory !== "All" && (
                <div className="relative flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-lg">
                  <span>Category: {selectedCategory}</span>
                  <X
                    size={14}
                    className="text-gray-600 cursor-pointer hover:text-black"
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>
        {/* Highlight calculations*/}
        <div className="flex">
          <div
            className="flex  gap-10 mt-1 bg-white h-[100px] items-center rounded-xl px-4 w-full"
            style={{
              boxShadow:
                "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
            }}
          >
            {[
              { label: "Total Income", value: totalIncome },
              { label: "Total Expense", value: totalExpense },
              { label: "Total Savings", value: totalSaving },
              { label: "Balance", value: balance > 0 ? balance : 0 },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center min-w-[120px]"
              >
                <span className="text-sm text-gray-600">{item.label}</span>
                {isLoading ? (
                  <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse" />
                ) : (
                  <span className="text-2xl font-bold text-black">
                    ₹{item.value.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            ))}

            <div className="flex items-center justify-center gap-4 ">
              <h3 className="text-md font-medium text-gray-600 mb-[2px] ">
                Income Distribution:
              </h3>
              <div className="w-[300px] h-[150px] relative flex items-center justify-start">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-start">
                    <div className="w-[80px] h-[80px] bg-gray-200 rounded-full animate-pulse" />
                  </div>
                ) : (
                  <IncomePieChart
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                    totalSaving={totalSaving}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        .
        <div
          className="my-5 overflow-x-auto min-h-[500px] rounded-xl"
          style={{
            boxShadow:
              "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
          }}
        >
          <table className="min-w-full border-spacing-y-1 rounded-xl">
            <thead className="font-semibold text-white bg-gray-400">
              <tr>
                <th className="px-0 py-3 text-center">S.No.</th>

                {[
                  { label: "Transaction Date", key: "rawDate" },
                  { label: "Type", key: "type" },
                  { label: "Amount", key: "amount" },
                  { label: "Category", key: "category" },
                  { label: "Created At", key: "rawCreatedAt" },
                ].map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left">
                    <div className="flex items-center justify-start gap-1">
                      <span className="pr-5">{col.label}</span>
                      <div className="flex flex-col ">
                        <ChevronUp
                          size={14}
                          className={`cursor-pointer ${
                            sortConfig.key === col.key &&
                            sortConfig.direction === "asc"
                              ? "text-purple-500"
                              : "text-white/80"
                          }`}
                          onClick={() =>
                            setSortConfig({
                              key: col.key as any,
                              direction: "asc",
                            })
                          }
                        />
                        <ChevronDown
                          size={14}
                          className={`cursor-pointer ${
                            sortConfig.key === col.key &&
                            sortConfig.direction === "desc"
                              ? "text-purple-300"
                              : "text-white/80"
                          }`}
                          onClick={() =>
                            setSortConfig({
                              key: col.key as any,
                              direction: "desc",
                            })
                          }
                        />
                      </div>
                    </div>
                  </th>
                ))}
                <th className="px-0 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-800">
              {isLoading ? (
                // Show skeleton rows
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="bg-white rounded animate-pulse">
                    {Array.from({ length: 7 }).map((__, i) => (
                      <td key={i} className="px-4 py-3">
                        <div className="w-full h-4 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                // Show real data rows
                paginatedData.map((txn, index) => {
                  const actualIndex = transactions.findIndex(
                    (t) =>
                      new Date(t.date).getTime() ===
                        new Date(txn.rawDate).getTime() &&
                      new Date(t.createdAt).getTime() ===
                        new Date(txn.rawCreatedAt).getTime() &&
                      t.category === txn.category &&
                      t.type === txn.type &&
                      Number(t.amount) === Number(txn.amount)
                  );

                  let icon = null;
                  let color = "text-black";

                  if (txn.type === "Income") {
                    icon = <Plus size={14} className="inline mr-1" />;
                    color = "text-green-500";
                  } else if (txn.type === "Expense") {
                    icon = <Minus size={14} className="inline mr-1" />;
                    color = "text-red-500";
                  } else if (txn.type === "Savings") {
                    icon = <Asterisk size={14} className="inline mr-1" />;
                    color = "text-blue-500";
                  }

                  return (
                    <tr
                      key={index}
                      className="text-center transition-colors duration-150 bg-white rounded hover:bg-gray-100"
                    >
                      <td className="px-4 py-3 font-medium">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 text-left">{txn.date}</td>
                      <td className="px-4 py-3 text-left">{txn.type}</td>
                      <td className={`px-4 py-3 text-left ${color}`}>
                        <span className="flex items-center justify-start gap-1">
                          {icon} ₹{txn.amount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-left">{txn.category}</td>
                      <td className="px-4 py-3 text-left whitespace-nowrap">
                        {txn.createdAt}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-4">
                          <button
                            className="text-gray-600 hover:text-blue-500"
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Edit"
                            onClick={() => {
                              router.push(`/transactionform/${actualIndex}`);
                            }}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="text-gray-600 hover:text-red-500"
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Delete"
                            onClick={() => {
                              setSelectedIndex(actualIndex);
                              setShowConfirm(true);
                            }}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                // No data fallback (optional)
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTransactions.length / rowsPerPage)}
          onPageChange={setCurrentPage}
        />
        {/* Charts */}
        <div className="mb-5">
          <Charts />
        </div>
        {/* Tooltip & Toast */}
        <Tooltip
          id="tooltip"
          place="top"
          className="!py-1 !px-2 !rounded-md !shadow-lg z-50 !text-sm  !text-center"
        />
        {/* Logout Confirmation */}
        <ConfirmModal
          isOpen={showLogoutConfirm}
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            setShowLogoutConfirm(false);
            router.push("/login");
          }}
          title="Confirm Logout"
          message="Are you sure you want to log out?"
        />
        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={showConfirm}
          onCancel={() => setShowConfirm(false)}
          title="Confirm Delete"
          message="Are you sure you want to delete the transaction?"
          onConfirm={() => {
            if (selectedIndex !== null) {
              const success = deleteTransaction(selectedIndex);

              if (!success) {
                showError("Cannot delete. Not enough income.", "Delete-error");
                return;
              }
              showSuccess("Deleted Successfully", "Delete-success");
              setSelectedIndex(null);
              setShowConfirm(false);
            }
          }}
        />
      </div>
    </>
  );
}
