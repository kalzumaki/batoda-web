"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { Officers } from "@/types/user";
import { userManagement } from "@/constants/userTypeMap";
import { X } from "lucide-react";
import UserQRPreviewModal from "./UserQRPreviewModal";

const UsersGenerateQRModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<Officers[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Officers | null>(null);

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
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-[#3d5554] mb-4">
              Users List
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto border rounded-md">
                <table className="w-full text-sm text-left text-gray-600">
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
                              onClick={() => setSelectedUser(user)}
                              className="text-white bg-[#3d5554] hover:bg-[#2c3f3e] transition-all px-3 py-1 rounded text-xs"
                            >
                              Generate QR
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {selectedUser && (
              <UserQRPreviewModal
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UsersGenerateQRModal;
