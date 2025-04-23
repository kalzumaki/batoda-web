"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";

interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  user_type: {
    id: number;
    name: string;
  };
  is_approved: number;
  email_verified_at: string | null;
  deleted_at: string | null;
}

const UsersBody: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("userToken");

      if (!token) {
        setError("User token missing. Please login again.");
        toast.error("User token missing. Please login again.");
        return;
      }

      const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_USERS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        setError("Unauthorized access.");
        return;
      }

      const data = await res.json();

      if (data.status) {
        setUsers(data.users);
      } else {
        setError(data.message || "Failed to fetch users.");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateApprovalStatus = async (id: number) => {
    try {
      const token = Cookies.get("userToken");

      const res = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.APPROVE_USER(id)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_approved: 1 }),
        }
      );

      const data = await res.json();

      if (data.status) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, is_approved: 1 } : user
          )
        );

        toast.success("User approved successfully!");
        await fetchUsers();
      } else {
        toast.error(data.message || "Failed to approve user.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    }
  };

  const updateBlockStatus = async (id: number, block: boolean) => {
    try {
      const token = Cookies.get("userToken");

      const endpoint = block
        ? ENDPOINTS.BLOCK_USER(id)
        : ENDPOINTS.UNBLOCK_USER(id);

      const res = await fetch(`/api/proxy?endpoint=${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.status) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id
              ? { ...user, deleted_at: block ? new Date().toISOString() : null }
              : user
          )
        );
        toast.success(`User has been ${block ? "blocked" : "restored"}`);
      } else {
        toast.error(data.message || `Failed to ${block ? "block" : "restore"} user.`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full table-auto border border-[#3d5554] bg-white">
          <thead className="bg-[#3d5554] text-white">
            <tr>
              <th className="py-3 px-5 border text-left">ID</th>
              <th className="py-3 px-5 border text-left">Full Name</th>
              <th className="py-3 px-5 border text-left">Email</th>
              <th className="py-3 px-5 border text-left">User Type</th>
              <th className="py-3 px-5 border text-left">Approved</th>
              <th className="py-3 px-5 border text-left">Email Verified</th>
              <th className="py-3 px-5 border text-left">Blocked</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {users.map((user) => {
              const isBlocked = user.deleted_at !== null;
              const isPassenger =
                user.user_type.name.toLowerCase() === "passenger";

              return (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-100 transition-colors ${
                    isBlocked ? "bg-red-200" : ""
                  }`}
                >
                  <td className="py-3 px-5 border">{user.id}</td>
                  <td className="py-3 px-5 border">
                    {user.fname} {user.lname}
                  </td>
                  <td className="py-3 px-5 border">{user.email}</td>
                  <td className="py-3 px-5 border capitalize">
                    {user.user_type.name}
                  </td>
                  <td className="py-3 px-5 border">
                    {isPassenger ? (
                      "Auto-approved"
                    ) : user.is_approved === 1 ? (
                      "Approved"
                    ) : (
                      <select
                        onChange={() => updateApprovalStatus(user.id)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="1">Approve</option>
                      </select>
                    )}
                  </td>

                  <td className="py-3 px-5 border">
                    {user.email_verified_at ? "Yes" : "X"}
                  </td>
                  <td className="py-3 px-5 border">
                    <select
                      value={isBlocked ? "blocked" : "active"}
                      onChange={(e) =>
                        updateBlockStatus(user.id, e.target.value === "blocked")
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="active">Restore</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersBody;
