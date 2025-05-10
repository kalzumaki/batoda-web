"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AuditorChart = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = Cookies.get("userToken");

    try {
      const res = await fetch(
        `/api/proxy?endpoint=${encodeURIComponent(ENDPOINTS.GET_AUDITOR_DB)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      if (result.status) {
        setData(result.history);
      }
    } catch (err) {
      console.error("Failed to fetch auditor data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Preparing chart data
  const chartData = {
    labels: data?.map((item: any) => item.month) || [], // Labels for months
    datasets: [
      {
        label: "Total Passengers",
        data: data?.map((item: any) => item.total_passengers) || [],
        backgroundColor: "#34d399", // green
        borderRadius: 6,
        barThickness: 40,
      },
      {
        label: "Total Drivers",
        data: data?.map((item: any) => item.total_drivers) || [],
        backgroundColor: "#6366f1", // indigo
        borderRadius: 6,
        barThickness: 40,
      },
      {
        label: "Total Reserved",
        data: data?.map((item: any) => item.total_reserved) || [],
        backgroundColor: "#f59e0b", // amber
        borderRadius: 6,
        barThickness: 40,
      },
      {
        label: "Total Cancelled",
        data: data?.map((item: any) => item.total_cancelled) || [],
        backgroundColor: "#ef4444", // red
        borderRadius: 6,
        barThickness: 40,
      },
      {
        label: "Total Contribution",
        data: data?.map((item: any) => item.total_contribution) || [],
        backgroundColor: "#3b82f6", // blue
        borderRadius: 6,
        barThickness: 40,
      },
      {
        label: "Total Dispatcher Share",
        data: data?.map((item: any) => item.total_dispatcher_share) || [],
        backgroundColor: "#a855f7", // purple
        borderRadius: 6,
        barThickness: 40,
      },
      {
        label: "Total Batoda Share",
        data: data?.map((item: any) => item.total_batoda_share) || [],
        backgroundColor: "#10b981", // emerald
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: false,
        text: "Auditor Dashboard Summary",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };
  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-[#2d665f]">
          Batoda Monthly Summary
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#2d665f] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-[350px]">
            {" "}
            {/* Adjust chart height here */}
            <Bar
              data={chartData}
              options={{
                ...chartOptions,
                maintainAspectRatio: false, // Allow the chart to fill container
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditorChart;
