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
  user_valid_id?: {
    id_number: string;
    front_image: string;
    back_image: string;
  };
  has_brgy_clearance?: {
    image: string;
  };
}

const UsersBody: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title: string, images: string[]) => {
    setModalTitle(title);
    setModalImages(images);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImages([]);
    setModalTitle("");
  };

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
        toast.success("User approved successfully!");
        fetchUsers();
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
        toast.success(`User ${block ? "blocked" : "unblocked"} successfully!`);
        fetchUsers();
      } else {
        toast.error(
          data.message || `Failed to ${block ? "block" : "unblock"} user.`
        );
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    }
  };

  const getProxiedImageUrl = (path: string) => {
    const fullImageUrl = `${process.env.NEXT_PUBLIC_API_STORAGE}storage/${path}`;
    return `/api/image-proxy?url=${encodeURIComponent(fullImageUrl)}`;
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
              <th className="py-3 px-5 border text-left">Valid ID</th>
              <th className="py-3 px-5 border text-left">Brgy Clearance</th>
              <th className="py-3 px-5 border text-left">Actions</th>
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
                    {user.is_approved === 1 ? "Approved" : "Pending"}
                  </td>
                  <td className="py-3 px-5 border">
                    {user.email_verified_at ? "Yes" : "No"}
                  </td>

                  {/* Valid ID */}
                  <td className="py-3 px-5 border">
                    {user.user_valid_id ? (
                      <button
                        onClick={() =>
                          openModal("Valid ID", [
                            getProxiedImageUrl(
                              user.user_valid_id?.front_image || ""
                            ),
                            getProxiedImageUrl(
                              user.user_valid_id?.back_image || ""
                            ),
                          ])
                        }
                        className="text-blue-600 underline text-sm"
                      >
                        View ID
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Brgy Clearance */}
                  <td className="py-3 px-5 border">
                    {user.has_brgy_clearance?.image ? (
                      <button
                        onClick={() =>
                          openModal("Barangay Clearance", [
                            getProxiedImageUrl(
                              user.has_brgy_clearance?.image || ""
                            ),
                          ])
                        }
                        className="text-blue-600 underline text-sm"
                      >
                        View Clearance
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-5 border text-center space-y-2">
                    {!isPassenger && user.is_approved !== 1 && (
                      <button
                        onClick={() => updateApprovalStatus(user.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}

                    {isBlocked ? (
                      <button
                        onClick={() => updateBlockStatus(user.id, false)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => updateBlockStatus(user.id, true)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{modalTitle}</h2>
            <div className="space-y-4">
              {modalImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Modal Image ${index + 1}`}
                  className="w-full object-contain border"
                />
              ))}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersBody;
