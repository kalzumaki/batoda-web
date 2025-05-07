import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { TotalContribution, DriversMostSales } from "@/types/contribution";
import { FaCoins, FaUsers } from "react-icons/fa";

const FinancesSubHeader = () => {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [contribution, setContribution] = useState<TotalContribution>();
  const [sales, setSales] = useState<DriversMostSales>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Total Contribution Card */}
      <div className="bg-[#3d5554] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaCoins className="text-yellow-400 text-2xl mr-2" />
          <h2 className="text-xl font-semibold">
            Monthly Contribution Summary
          </h2>
        </div>
        {contribution?.history?.map((item, idx) => (
          <div key={idx} className="text-sm border-t border-white/30 pt-3 mt-3">
            <p>
              <strong>Month:</strong> {item.month}
            </p>
            <p>
              <strong>Total:</strong> ₱{item.total_contribution}
            </p>
            <p>
              <strong>Dispatcher Share:</strong> ₱{item.total_dispatcher_share}
            </p>
            <p>
              <strong>BATODA Share:</strong> ₱{item.total_batoda_share}
            </p>
          </div>
        ))}
      </div>

      {/* Drivers Most Sales Card */}
      <div className="bg-[#3d5554] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaUsers className="text-green-400 text-2xl mr-2" />
          <h2 className="text-xl font-semibold">Top Performing Drivers</h2>
        </div>
        {sales?.drivers.length ? (
          <ul className="text-sm space-y-2">
            {sales.drivers.map((driver, idx) => (
              <li key={idx} className="border-b border-white/20 pb-2">
                <p>
                  <strong>{driver.full_name}</strong>
                </p>
                <p>Tricycle #: {driver.tricycle_number ?? "N/A"}</p>
                <p>Tickets Sold: {driver.ticket_count}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sales data available.</p>
        )}
      </div>
    </div>
  );
};

export default FinancesSubHeader;
