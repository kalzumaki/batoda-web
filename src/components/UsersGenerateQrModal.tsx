"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { Officers } from "@/types/user";
import { userManagement } from "@/constants/userTypeMap";



const UsersGenerateQRModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<Officers[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("userToken");

      const response = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.GET_ALL_USERS}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUsers(data.data || []);
      } else {
        alert(data.message || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while fetching the user list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchUsers();
  }, [isOpen]);

  return (
    <>
      <button
        onClick={toggleModal}
        className="px-4 py-2 bg-[#3d5554] text-white rounded-md hover:bg-[#2c3f3e] transition-all"
      >
        Manage QR Codes
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
            <h2 className="text-xl font-semibold text-[#3d5554] mb-4">
              Users List
            </h2>

            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <table className="w-full text-sm text-left text-gray-600 border">
                <thead className="bg-gray-100 text-[#3d5554]">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Mobile</th>
                    <th className="px-4 py-2 border">Role</th>
                    <th className="px-4 py-2 border text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="px-4 py-2">
                          {user.fname} {user.lname}
                        </td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.mobile_number}</td>
                        <td className="px-4 py-2">
                          {userManagement[user.user_type_id]}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() =>
                              console.log("Generate QR for:", user)
                            }
                            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                          >
                            Generate QR
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={toggleModal}
                className="mt-4 px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersGenerateQRModal;
