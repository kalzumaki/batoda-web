"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  onDateRangeChange?: (range: { from: Date | null; to: Date | null }) => void;
  onCustomFilterChange?: (filterKey: string, value: string) => void;
  customFilters?: {
    label: string;
    key: string;
    options: FilterOption[];
  }[];
  showDateRange?: boolean;
  showSearch?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearchChange,
  onDateRangeChange,
  onCustomFilterChange,
  customFilters = [],
  showDateRange = false,
  showSearch = true,
}) => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  };

  const handleDateChange = (type: "from" | "to", date: Date | null) => {
    const newRange = {
      from: type === "from" ? date : fromDate,
      to: type === "to" ? date : toDate,
    };
    if (type === "from") setFromDate(date);
    else setToDate(date);

    if (onDateRangeChange) {
      onDateRangeChange(newRange);
    }
  };

  return (
    <div className="flex flex-wrap items-start gap-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm mb-6 text-black">
      {showSearch && (
        <div className="flex flex-col w-full sm:w-1/2 md:w-auto min-w-0">
          <label className="text-sm mb-1 font-medium">Search</label>
          <input
            type="text"
            placeholder="Enter keyword..."
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] w-full text-black"
          />
        </div>
      )}

      {showDateRange && (
        <>
          <div className="flex flex-col w-full sm:w-1/2 md:w-auto min-w-0">
            <label className="text-sm mb-1 font-medium">From Date</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => handleDateChange("from", date)}
              placeholderText="Select start date"
              className="px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] w-full text-black"
            />
          </div>

          <div className="flex flex-col w-full sm:w-1/2 md:w-auto min-w-0">
            <label className="text-sm mb-1 font-medium">To Date</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => handleDateChange("to", date)}
              placeholderText="Select end date"
              className="px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] w-full text-black"
            />
          </div>
        </>
      )}

      {customFilters.length > 0 &&
        customFilters.map((filter) => (
          <div
            key={filter.key}
            className="flex flex-col w-full sm:w-1/2 md:w-auto min-w-0"
          >
            <label className="text-sm mb-1 font-medium">{filter.label}</label>
            <select
              onChange={(e) =>
                onCustomFilterChange?.(filter.key, e.target.value)
              }
              className="px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] w-full text-black"
            >
              <option value="">All</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
    </div>
  );
};

export default FilterBar;
