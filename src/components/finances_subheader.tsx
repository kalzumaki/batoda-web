"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { TotalContribution, DriversMostSales } from "@/types/contribution";
import { FaCoins, FaUsers } from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const FinancesSubHeader = () => {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [contribution, setContribution] = useState<TotalContribution>();
  const [sales, setSales] = useState<DriversMostSales>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  const latest = contribution?.history?.[0];
  const topDrivers = sales?.drivers?.slice(0, 5);
  const top5Months = contribution?.history?.slice(0, 5) || [];

  const fetchUserAndFinances = async () => {
    try {
      const token = Cookies.get("userToken");

      if (!token) {
        toast.error("User token is missing.");
        return;
      }

      const userRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = await userRes.json();
      if (userRes.ok && userData.status) {
        setFname(userData.data.fname);
        setLname(userData.data.lname);
      } else {
        toast.error(userData.message || "Failed to fetch user profile.");
      }

      const contributionRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.GET_TOTAL_CONTRIBUTION}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const contributionData = await contributionRes.json();
      if (contributionRes.ok && contributionData.status) {
        setContribution(contributionData);
      } else {
        throw new Error(
          contributionData.message || "Failed to fetch contribution."
        );
      }

      const salesRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.GET_DRIVER_MOST_SALES}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const salesData = await salesRes.json();
      if (salesRes.ok && salesData.status) {
        setSales(salesData);
      } else {
        throw new Error("Failed to fetch most sales driver.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setFadeIn(true);
    }
  };

  useEffect(() => {
    fetchUserAndFinances();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">{error}</p>;
  }

  const barChartData = {
    labels: top5Months.map((record) => record.month),
    datasets: [
      {
        label: "Total Contribution",
        data: top5Months.map((record) => record.total_contribution),
        backgroundColor: top5Months.map((_, idx) => {
          const colors = [
            "#2d665f",
            "#A60000",
            "#DAF7A6",
            "#FF5733",
            "#FF8D1A",
          ];
          return colors[idx % colors.length];
        }),
        borderColor: "#234d48",
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: topDrivers?.map((driver) => driver.full_name) || [],
    datasets: [
      {
        data: topDrivers?.map((driver) => driver.ticket_count) || [],
        backgroundColor: [
          "#FF8D1A",
          "#DAF7A6",
          "#2d665f",
          "#FF5733",
          "#A60000",
        ],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Contribution Card */}
        <div className="bg-[#2d665f] text-white p-6 rounded-2xl shadow-lg w-full">
          <div className="flex items-center mb-6">
            <div className="bg-yellow-400 p-3 rounded-full mr-4">
              <FaCoins className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold tracking-wide">
              Latest Contribution
            </h2>
          </div>
          {latest ? (
            <div className="space-y-2 text-lg leading-6">
              <p>
                <strong>Month:</strong> {latest.month}
              </p>
              <p>
                <strong>Total:</strong> ₱{latest.total_contribution.toFixed(2)}
              </p>
              <p>
                <strong>Dispatcher Share:</strong> ₱
                {latest.total_dispatcher_share.toFixed(2)}
              </p>
              <p>
                <strong>BATODA Share:</strong> ₱
                {latest.total_batoda_share.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-gray-300 text-lg">
              No contribution data available.
            </p>
          )}
        </div>

        {/* Top Driver Card */}
        <div className="bg-[#2d665f] text-white p-6 rounded-2xl shadow-lg w-full">
          <div className="flex items-center mb-6">
            <div className="bg-green-400 p-3 rounded-full mr-4">
              <FaUsers className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold tracking-wide">Top Driver</h2>
          </div>
          {topDrivers ? (
            <div className="space-y-2 text-lg leading-6">
              <p>
                <strong>Name:</strong> {topDrivers[0]?.full_name}
              </p>
              <p>
                <strong>Tricycle #:</strong>{" "}
                {topDrivers[0]?.tricycle_number ?? "N/A"}
              </p>
              <p>
                <strong>Tickets Sold:</strong> {topDrivers[0]?.ticket_count}
              </p>
            </div>
          ) : (
            <p className="text-gray-300 text-lg">
              No driver sales data available.
            </p>
          )}
        </div>
      </div>

      {/* Graphs: Bar and Doughnut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Bar Chart */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-[#2d665f] text-center">
            Total Contribution
          </h3>
          <div className="w-full aspect-[4/3]">
            <Bar
              data={barChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-[#2d665f] text-center">
            Top Drivers
          </h3>
          <div className="w-full aspect-square max-w-[400px]">
            <Doughnut
              data={doughnutChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancesSubHeader;
