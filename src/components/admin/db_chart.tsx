"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BankRecord {
  date: string;
  entries: number;
  total_balance: string;
}

const DbChart: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date("2025-04-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2025-04-30"));
  const [records, setRecords] = useState<BankRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchChartData = async () => {
    const token = Cookies.get("userToken");
    setLoading(true);
    try {
      const response = await fetch(
        `/api/proxy?endpoint=${encodeURIComponent(
          ENDPOINTS.GET_BANK_RECORD_BY_DATE(
            formatDate(startDate),
            formatDate(endDate)
          )
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setRecords(data.data);
      } else {
        console.error("Failed to fetch records:", data.message);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [startDate, endDate]);

  const chartData = {
    labels: records.map((record) => record.date),
    datasets: [
      {
        label: "Entries per Day",
        data: records.map((record) => record.entries),
        borderColor: "#2d665f",
        backgroundColor: "rgba(45, 102, 95, 0.2)",
        tension: 0.3,
      },
      {
        label: "Total Balance",
        data: records.map((record) => parseFloat(record.total_balance)),
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Daily Entries and Balance Trend",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 flex flex-wrap gap-6 items-center justify-between">
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => {
              if (date) setStartDate(date);
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            dateFormat="yyyy-MM-dd"
            showPopperArrow={false}
            popperClassName="z-50"
            calendarClassName="rounded-lg shadow-lg"
            wrapperClassName="relative"
          />
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/3">
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => {
              if (date) setEndDate(date);
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            dateFormat="yyyy-MM-dd"
            showPopperArrow={false}
            popperClassName="z-50"
            calendarClassName="rounded-lg shadow-lg"
            wrapperClassName="relative"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-[#2d665f]">
          Entries & Balance Trend
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#2d665f] rounded-full animate-spin"></div>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default DbChart;
