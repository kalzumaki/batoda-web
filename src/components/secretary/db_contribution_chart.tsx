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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ContributionChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = Cookies.get("userToken");

      try {
        const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_TOTAL_CONTRIBUTION}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch data");

        const labels = data.history.map((entry: any) => entry.month);
        const totalContributions = data.history.map((entry: any) => entry.total_contribution);
        const dispatcherShares = data.history.map((entry: any) => entry.total_dispatcher_share);
        const batodaShares = data.history.map((entry: any) => entry.total_batoda_share);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Contribution",
              data: totalContributions,
              backgroundColor: "rgba(255, 159, 64, 0.6)",
            },
            {
              label: "Dispatcher Share",
              data: dispatcherShares,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Batoda Share",
              data: batodaShares,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Contribution Breakdown",
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
      <div className="bg-white p-4 rounded-lg shadow-md min-h-[400px]">
        <h3 className="text-lg font-semibold mb-4 text-[#2d665f]">
          Monthly Contributions
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#2d665f] rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default ContributionChart;
