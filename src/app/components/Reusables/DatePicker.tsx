"use client";
import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { DatePickerComponentProps } from "../../data/types";

export default function DatePickerComponent({
  selectedDate,
  onChangeDate,
  placeholder,
}: DatePickerComponentProps) {
  const datePickerRef = useRef<any>(null);

  const openCalendar = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent bubbling
    datePickerRef.current?.setOpen(true);
  };

  return (
    <div className="relative z-50 w-full border border-gray-300 rounded-lg cursor-pointer">
      <div onClick={openCalendar} className="absolute inset-0 z-10"></div>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          onChangeDate(date);
          datePickerRef.current?.setOpen(false);
        }}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
        className="block w-full py-3 pl-3 pr-10 text-sm text-gray-800 placeholder-gray-800 rounded-lg focus:outline-none"
        ref={datePickerRef}
        popperClassName="z-50"
        maxDate={new Date()}
        popperPlacement="bottom-start"
      />

      {/* Calendar Icon */}
      <Calendar
        className="absolute text-gray-800 -translate-y-1/2 pointer-events-none right-3 top-1/2"
        size={18}
      />
    </div>
  );
}
