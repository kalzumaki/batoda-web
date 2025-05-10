"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
// Type Definitions
interface User {
  id: number;
  fname: string;
  lname: string;
}

interface Transaction {
  id: number;
  from_user_id: number;
  to_user_id: number;
  amount: string;
  reference_no: string;
  created_at: string;
  from_user: User;
  to_user: User;
}

interface Receipt {
  id: number;
  reference_no: string;
  total_cost: string;
  date: string;
}

interface MonthlyDispatch {
  month: string;
  count: number;
}

interface TreasurerData {
  totals: {
    dispatches: number;
    transactions: number;
    receipts: number;
    batoda_balance: string;
  };
  monthly_dispatches: MonthlyDispatch[];
  latest_transactions: Transaction[];
  recent_receipts: Receipt[];
}

const Treasurer: React.FC = () => {
  const [data, setData] = useState<TreasurerData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = Cookies.get("userToken");
        const res = await fetch(
          `/api/proxy?endpoint=${ENDPOINTS.GET_TREASURER_DB}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Parsing the response data as JSON
        const responseData = await res.json();

        if (responseData.status) setData(responseData.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <div>Loading...</div>;

  const { totals, latest_transactions, recent_receipts } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Dispatches", value: totals.dispatches },
          { title: "Transactions", value: totals.transactions },
          { title: "Receipts", value: totals.receipts },
          { title: "Batoda Balance", value: `₱${totals.batoda_balance}` },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[#3d5554] text-white p-4 rounded-2xl shadow-md"
          >
            <div className="text-sm">{item.title}</div>
            <div className="text-xl font-bold">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Latest Transactions */}
      <div className="bg-[#2d665f] text-white p-4 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Latest Transactions</h2>
        <ul className="space-y-2">
          {latest_transactions.map((tx) => (
            <li key={tx.id} className="border-b pb-2">
              <div className="font-medium">₱{tx.amount}</div>
              <div className="text-sm">
                From: {tx.from_user.fname} {tx.from_user.lname} → To:{" "}
                {tx.to_user.fname} {tx.to_user.lname}
              </div>
              <div className="text-xs">
                {new Date(tx.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Receipts */}
      <div className="bg-[#2d665f] text-white p-4 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Receipts</h2>
        <ul className="space-y-2">
          {recent_receipts.map((receipt) => (
            <li key={receipt.id} className="border-b pb-2">
              <div className="font-medium">Ref: {receipt.reference_no}</div>
              <div className="text-sm">₱{receipt.total_cost}</div>
              <div className="text-xs">
                {new Date(receipt.date).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Treasurer;
