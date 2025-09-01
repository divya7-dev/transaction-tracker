"use client";

import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import {
  subDays,
  format,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { DateRangePickerProps } from "@/app/data/types";

export default function DateRangePicker({
  dateRange,
  setDateRange,
  showPanel,
  setShowPanel,
}:  DateRangePickerProps) {
  const [selectedOption, setSelectedOption] = useState("Custom");
  const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([null, null]);
  const [inputText, setInputText] = useState("");
  const [startDate, endDate] = dateRange;

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowPanel(false);
        setDateRange([null, null]);
        setInputText("");
      }
    };

    if (showPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPanel]);


  useEffect(() => {
  const formatDate = (date: Date) => format(date, "dd MMM yyyy");

  if (startDate && endDate) {
    const sameDay = startDate.toDateString() === endDate.toDateString();
    setInputText(sameDay ? formatDate(startDate) : `${formatDate(startDate)} - ${formatDate(endDate)}`);
  } else if (startDate && !endDate) {
    setInputText(formatDate(startDate));
  } else {
    setInputText("");
  }
}, [startDate, endDate]);

  const handlePreset = (option: string) => {
    setSelectedOption(option);
    const now = new Date();
    let from: Date;
    let to: Date;

    switch (option) {
      case "Today":
        from = new Date(now.setHours(0, 0, 0, 0));
        to = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "Yesterday":
        const y = subDays(now, 1);
        from = new Date(y.setHours(0, 0, 0, 0));
        to = new Date(y.setHours(23, 59, 59, 999));
        break;
      case "Last 7 days":
        from = subDays(now, 6);
        from.setHours(0, 0, 0, 0);
        to = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "Last Week":
        const lastWeek = subWeeks(now, 1);
        from = startOfWeek(lastWeek, { weekStartsOn: 0 });
        from.setHours(0, 0, 0, 0);
        to = endOfWeek(lastWeek, { weekStartsOn: 0 });
        to.setHours(23, 59, 59, 999);
        break;
      case "Last 1 Month":
        from = subDays(now, 29);
        from.setHours(0, 0, 0, 0);
        to = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "Custom":
        setTempRange([null, null]);
        return;
      default:
        return;
    }

    setTempRange([from, to]);
  };

  const handleApply = () => {
    setDateRange(tempRange);
    setShowPanel(false);
  };

  const handleCancel = () => {
    setTempRange(dateRange);
    setShowPanel(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Input Field */}
      <div className="flex items-center border border-gray-300 rounded-lg min-w-[220px] text-sm text-gray-600 pl-3 pr-2 py-2 ">
        <input
          readOnly
          className="flex-1 text-sm placeholder-gray-800 bg-transparent outline-none cursor-pointer"
          placeholder="Select Transaction Date"
          value={inputText}
          onClick={() => {
            setTempRange(dateRange);
            setShowPanel(true);
          }}
        />
        <Calendar
          className="w-5 h-5 text-gray-500 cursor-pointer"
          onClick={() => {
            setTempRange(dateRange);
            setShowPanel(true);
          }}
        />
      </div>

      {/* Date Picker Panel */}
      {showPanel && (
        <div className="absolute z-50 mt-2 bg-white rounded-md shadow-lg flex gap-0 w-[450px]">
          <div className="flex">
            <DatePicker
              selectsRange
              startDate={tempRange[0]}
              endDate={tempRange[1]}
              onChange={(update: [Date | null, Date | null]) => {
                if (selectedOption === "Custom") {
                  setTempRange(update);
                }
              }}
              inline
              filterDate={() => selectedOption === "Custom"}
              maxDate={new Date()} 
            />
          </div>

          <div className="flex flex-col justify-between w-[200px] p-4">
            <div className="flex flex-col gap-2">
              {[
                "Today",
                "Yesterday",
                "Last 7 days",
                "Last Week",
                "Last 1 Month",
                "Custom",
              ].map((label) => (
                <label key={label} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={label}
                    checked={selectedOption === label}
                    onChange={() => handlePreset(label)}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="flex justify-start gap-4 mt-4">
              <button
                onClick={handleApply}
                className="px-4 py-1 text-white bg-purple-500 border rounded-lg cursor-pointer hover:bg-purple-600"
              >
                Apply
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-1 text-white bg-gray-400 border rounded-lg cursor-pointer hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
