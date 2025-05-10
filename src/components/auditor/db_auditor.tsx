"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { ArrowRight, CreditCard, Wallet, } from "lucide-react";

interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
}

interface Transaction {
  id: number;
  amount: string;
  reference_no: string;
  created_at: string;
  from_user: User;
  to_user: User;
}

interface Receipt {
  id: number;
  reference_no: string;
  dispatcher: string;
  passenger: string | null;
  driver: string;
  total_cost: string;
  payment_method: string;
  date: string;
}

interface Totals {
  transactions: number;
  receipts: number;
  total_collected: string;
}

interface DashboardData {
  totals: Totals;
  recent_transactions: Transaction[];
  recent_receipts: Receipt[];
}

const Auditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `/api/proxy?endpoint=${ENDPOINTS.GET_AUDITOR_CARD}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData = await response.json();
        if (responseData.status) {
          setDashboardData(responseData.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );

  if (!dashboardData)
    return <div className="text-center">No data available.</div>;

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen text-[#3d5554]">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="w-full p-5 rounded-lg shadow-md bg-[#3d5554] text-white flex items-center gap-4">
          <CreditCard className="w-8 h-8 text-white" />
          <div>
            <h2 className="font-semibold text-sm uppercase">
              Total Transactions
            </h2>
            <p className="text-2xl">{dashboardData.totals.transactions}</p>
          </div>
        </div>

        <div className="w-full p-5 rounded-lg shadow-md bg-[#3d5554] text-white flex items-center gap-4">
          <Wallet className="w-8 h-8 text-white" />
          <div>
            <h2 className="font-semibold text-sm uppercase">Total Collected</h2>
            <p className="text-2xl">₱{dashboardData.totals.total_collected}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#2d665f] mb-4">
          Recent Transactions
        </h2>
        <div className="space-y-4">
          {dashboardData.recent_transactions.map((tx) => (
            <div key={tx.id} className="p-4 bg-white rounded-lg shadow">
              <p className="flex items-center gap-1">
                <strong>
                  {tx.from_user.fname} {tx.from_user.lname}
                </strong>
                <ArrowRight className="w-4 h-4 text-[#2d665f]" />
                <strong>
                  {tx.to_user.fname} {tx.to_user.lname}
                </strong>
              </p>

              <p>Amount: ₱{tx.amount}</p>
              <p>Reference: {tx.reference_no}</p>
              <p>Date: {new Date(tx.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#2d665f] mb-4">
          Recent Receipts
        </h2>
        <div className="space-y-4">
          {dashboardData.recent_receipts.map((receipt) => (
            <div key={receipt.id} className="p-4 bg-white rounded-lg shadow">
              <p>
                <strong>{receipt.passenger || receipt.driver || "N/A"}</strong>{" "}
                — ₱{receipt.total_cost}
              </p>
              <p>Driver: {receipt.driver}</p>
              <p>Payment: {receipt.payment_method}</p>
              <p>Date: {new Date(receipt.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auditor;
