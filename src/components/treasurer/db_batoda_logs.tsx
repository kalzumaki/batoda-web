"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { parseISO, format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface BatodaLog {
  id: number;
  driver: string;
  dispatcher: string;
  balance: string;
  dispatcher_fare: string;
  dispatcher_share: string;
  date: string;
  time: string;
  created_at: string;
}

const BatodaLogsChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const token = Cookies.get("userToken");

      try {
        const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_BATODA_LOGS}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.status) throw new Error(data.error || "Failed to fetch logs");

        const grouped: Record<string, { balance: number; fare: number; share: number }> = {};

        data.data.forEach((log: BatodaLog) => {
          const month = format(parseISO(log.created_at), "MMMM yyyy");

          if (!grouped[month]) {
            grouped[month] = { balance: 0, fare: 0, share: 0 };
          }

          grouped[month].balance += parseFloat(log.balance);
          grouped[month].fare += parseFloat(log.dispatcher_fare);
          grouped[month].share += parseFloat(log.dispatcher_share);
        });

        const allMonths = Object.keys(grouped);
        const recentMonths = allMonths.slice(-5);

        const balances = recentMonths.map((month) => grouped[month].balance);
        const fares = recentMonths.map((month) => grouped[month].fare);
        const shares = recentMonths.map((month) => grouped[month].share);

        setChartData({
          labels: recentMonths,
          datasets: [
            {
              type: "line" as const,
              label: "Balance",
              data: balances,
              borderColor: "#2d665f",
              backgroundColor: "rgba(45, 102, 95, 0.1)",
              tension: 0.3,
              fill: true,
              yAxisID: "y",
            },
            {
              type: "bar" as const,
              label: "Dispatcher Share",
              data: shares,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              yAxisID: "y",
            },
            {
              type: "bar" as const,
              label: "Dispatcher Fare",
              data: fares,
              backgroundColor: "rgba(255, 165, 0, 0.7)",
              yAxisID: "y",
            },
          ],
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Monthly Batoda Logs Summary",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md min-h-[400px]">
        <h3 className="text-lg font-semibold mb-4 text-[#2d665f]">
          Batoda Monthly Report
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#2d665f] rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center">{error}</div>
        ) : (
          <Chart type="bar" data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default BatodaLogsChart;
