"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { Officers } from "@/types/user";
import PrintToPDF from "../PrintToPdf";
import SubHeaderButton from "../SubHeaderButton";

const userTypeMap: Record<number, string> = {
  2: "President",
  3: "Secretary",
  4: "Treasurer",
  5: "Auditor",
};

const OfficersBody = () => {
  const [officers, setOfficers] = useState<Officers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOfficers = async () => {
    try {
      const token = Cookies.get("userToken");
      if (!token) throw new Error("User token missing.");

      const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_OFFICERS}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setOfficers(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch officers.");
      }
    } catch (err: any) {
      console.error("Error fetching officers:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id: number, deletedAt: string) => {
    try {
      const token = Cookies.get("userToken");
      const endpoint = deletedAt
        ? ENDPOINTS.UNBLOCK_USER(id)
        : ENDPOINTS.BLOCK_USER(id);

      const res = await fetch(`/api/proxy?endpoint=${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Status updated.");
        fetchOfficers();
      } else {
        throw new Error(data.message || "Action failed.");
      }
    } catch (err: any) {
      console.error("Toggle block error:", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <div className="p-6">
      <PrintToPDF
        title="List of Officers"
        fileName="officers-list.pdf"
        buttonLabel="Download Officers"
      >
        <SubHeaderButton />
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-[#3d5554] bg-white">
            <thead className="bg-[#3d5554] text-white">
              <tr>
                <th className="py-3 px-5 border text-left">First Name</th>
                <th className="py-3 px-5 border text-left">Last Name</th>
                <th className="py-3 px-5 border text-left">Email</th>
                <th className="py-3 px-5 border text-left">Mobile</th>
                <th className="py-3 px-5 border text-left">Address</th>
                <th className="py-3 px-5 border text-left">Birthday</th>
                <th className="py-3 px-5 border text-left">User Type</th>
                <th className="py-3 px-5 border text-left">Status</th>
                <th className="py-3 px-5 border text-left">Last Login</th>
                <th className="py-3 px-5 border text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {officers.map((officer) => (
                <tr
                  key={officer.id}
                  className={`transition-colors ${
                    officer.deleted_at
                      ? "bg-red-100 hover:bg-red-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <td className="py-3 px-5 border">{officer.fname}</td>
                  <td className="py-3 px-5 border">{officer.lname}</td>
                  <td className="py-3 px-5 border">{officer.email}</td>
                  <td className="py-3 px-5 border">{officer.mobile_number}</td>
                  <td className="py-3 px-5 border">{officer.address}</td>
                  <td className="py-3 px-5 border">{officer.birthday}</td>
                  <td className="py-3 px-5 border">
                    {userTypeMap[officer.user_type_id] || "Unknown"}
                  </td>
                  <td className="py-3 px-5 border">
                    {officer.is_active ? (
                      <span className="text-green-600 font-medium">Online</span>
                    ) : (
                      <span className="text-red-600 font-medium">Offline</span>
                    )}
                  </td>
                  <td className="py-3 px-5 border">
                    {officer.last_login_at
                      ? new Date(officer.last_login_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="py-3 px-5 border">
                    <button
                      onClick={() =>
                        toggleBlock(officer.id, officer.deleted_at)
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        officer.deleted_at
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {officer.deleted_at ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PrintToPDF>
    </div>
  );
};

export default OfficersBody;
