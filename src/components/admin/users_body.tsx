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
  const [modalImages, setModalImages] = useState<string[]>([]); // For storing images to show in the modal
  const [modalOpen, setModalOpen] = useState<boolean>(false); // To control modal visibility
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalIdNumber, setModalIdNumber] = useState<string>("");

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
  const openModal = (images: string[], title: string, idNumber?: string) => {
    const fullUrls = images.map((image) => {
      const isFullUrl =
        image.startsWith("http://") || image.startsWith("https://");
      const rawUrl = isFullUrl
        ? image
        : `${process.env.NEXT_PUBLIC_API_STORAGE}storage/${image}`;

      // Returning the final image URL with the proxy
      return `/api/image-proxy?url=${encodeURIComponent(rawUrl)}`;
    });

    setModalImages(fullUrls);
    setModalTitle(title);
    setModalIdNumber(idNumber || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
  };

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
        toast.error(
          data.message || `Failed to ${block ? "block" : "restore"} user.`
        );
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
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
              <th className="py-3 px-5 border text-left">Barangay Clearance</th>
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

                  {/* Valid ID Column */}
                  <td className="py-3 px-5 border">
                    {user.user_valid_id ? (
                      <button
                        onClick={() =>
                          openModal(
                            [
                              user.user_valid_id?.front_image || "",
                              user.user_valid_id?.back_image || "",
                            ],
                            "Valid ID",
                            user.user_valid_id?.id_number
                          )
                        }
                        className="text-blue-600 underline text-sm"
                      >
                        View ID
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Barangay Clearance Column */}
                  <td className="py-3 px-5 border">
                    {user.has_brgy_clearance ? (
                      <button
                        onClick={() =>
                          openModal(
                            [user.has_brgy_clearance?.image || ""],
                            "Brgy Clearance"
                          )
                        }
                        className="text-blue-600 underline text-sm"
                      >
                        View Clearance
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Block/Restore Column */}
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

      {/* Modal for displaying images */}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-center text-black">
              {modalTitle}
            </h2>
            <p className="text-center text-gray-700 mb-4">
              ID Number: <span className="font-medium">{modalIdNumber}</span>
            </p>

            {/* Spinner or Images */}
            {modalImages.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {modalImages.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full max-w-sm border rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersBody;
