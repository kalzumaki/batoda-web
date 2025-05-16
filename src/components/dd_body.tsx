"use client";

import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { DriverDispatcher } from "@/types/user";
import FilterBar from "./FilterBar";
import PrintToPDF from "./PrintToPdf";
import Image from "next/image";

const DriverDispatcherBody = () => {
  const [users, setUsers] = useState<DriverDispatcher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  // Filters
  const [search, setSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalIdNumber, setModalIdNumber] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = (images: string[], title: string, idNumber?: string) => {
    const fullUrls = images.map((image) => {
      const isFullUrl =
        image.startsWith("http://") || image.startsWith("https://");
      const rawUrl = isFullUrl
        ? image
        : `${process.env.NEXT_PUBLIC_API_STORAGE}storage/${image}`;
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

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("userToken");

      if (!token) {
        toast.error("User token is missing.");
        return;
      }

      // Fetch user profile
      const userRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = await userRes.json();

      if (userRes.ok && userData.status) {
        const data = userData.data;
        const { fname, lname } = data;

        setFname(fname);
        setLname(lname);
      } else {
        toast.error(userData.message || "Failed to fetch user profile.");
      }

      const response = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.GET_ALL_DRIVERS_DISPATCHERS}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data.data)) {
        setUsers(data.data);
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

  const toggleBlock = async (id: number, deletedAt: string | null) => {
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

      if (data.status) {
        toast.success(data.message || "Status updated.");
        fetchUsers();
      } else {
        toast.error(data.message || "Action failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.full_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.mobile_number.includes(search);

      //   const date =
      //     user.created_at && !isNaN(new Date(user.created_at).getTime())
      //       ? new Date(user.created_at)
      //       : null;

      //   const dateMatch =
      //     (!dateRange.from ||
      //       (date &&
      //         dateRange.from &&
      //         date.getTime() >= dateRange.from.getTime())) &&
      //     (!dateRange.to ||
      //       (date && dateRange.to && date.getTime() <= dateRange.to.getTime()));

      const userTypeMatch =
        !filters.user_type ||
        user.user_type.toLowerCase() === filters.user_type.toLowerCase();

      const statusMatch =
        !filters.status ||
        (filters.status === "active" && !user.deleted_at) ||
        (filters.status === "blocked" && user.deleted_at);

      return searchMatch && userTypeMatch && statusMatch;
    });
  }, [users, search, dateRange, filters]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <>
      <FilterBar
        onSearchChange={(text) => setSearch(text)}
        // onDateRangeChange={(range) => setDateRange(range)}
        onCustomFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        customFilters={[
          {
            label: "User Type",
            key: "user_type",
            options: [
              { label: "Driver", value: "driver" },
              { label: "Dispatcher", value: "dispatcher" },
            ],
          },
          {
            label: "Status",
            key: "status",
            options: [
              { label: "Unblocked", value: "active" },
              { label: "Blocked", value: "blocked" },
            ],
          },
        ]}
      />

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-600 py-4">
          No users match the current filters.
        </p>
      ) : (
        <div className="p-6">
          <PrintToPDF
            fileName="drivers_dispatchers_report.pdf"
            title="Driver & Dispatcher Report"
            buttonLabel="Download as PDF"
            generatedByFname={fname}
            generatedByLname={lname}
          >
            <div className="rounded-lg shadow overflow-x-auto">
              <div className="max-h-[450px] overflow-y-auto">
                <table className="min-w-full table-auto border border-[#3d5554] bg-white">
                  <thead className="bg-[#3d5554] text-white">
                    <tr>
                      <th className="py-3 px-5 border text-left">Profile</th>
                      <th className="py-3 px-5 border text-left">Full Name</th>
                      <th className="py-3 px-5 border text-left">Birthday</th>
                      <th className="py-3 px-5 border text-left">Email</th>
                      <th className="py-3 px-5 border text-left">Mobile</th>
                      <th className="py-3 px-5 border text-left">Address</th>
                      <th className="py-3 px-5 border text-left">User Type</th>
                      <th className="py-3 px-5 border text-left">Status</th>
                      <th className="py-3 px-5 border text-left">Last Login</th>
                      <th className="py-3 px-5 border text-left">
                        Tricycle No.
                      </th>
                      <th className="py-3 px-5 border text-left">
                        Brgy Clearance
                      </th>
                      <th className="py-3 px-5 border text-left">Valid ID</th>
                      <th className="py-3 px-5 border text-left">Action</th>
                    </tr>
                  </thead>

                  <tbody className="text-black">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`transition-colors ${
                          user.deleted_at
                            ? "bg-red-100 hover:bg-red-200"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {/* Profile */}
                        <td className="py-3 px-5 border">
                          {user.profile ? (
                            <img
                              src={`/api/image-proxy?url=${encodeURIComponent(
                                user.profile.startsWith("http://") ||
                                  user.profile.startsWith("https://")
                                  ? user.profile
                                  : `${process.env.NEXT_PUBLIC_API_STORAGE}storage/${user.profile}`
                              )}`}
                              alt="Profile"
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </td>

                        <td className="py-3 px-5 border">{user.full_name}</td>
                        <td className="py-3 px-5 border">{user.birthday}</td>
                        <td className="py-3 px-5 border">{user.email}</td>
                        <td className="py-3 px-5 border">
                          {user.mobile_number}
                        </td>
                        <td className="py-3 px-5 border">{user.address}</td>
                        <td className="py-3 px-5 border capitalize">
                          {user.user_type}
                        </td>
                        <td className="py-3 px-5 border">
                          {user.is_active ? (
                            <span className="text-green-600 font-medium">
                              Online
                            </span>
                          ) : (
                            <span className="text-red-600 font-medium">
                              Offline
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-5 border">
                          {user.last_login_at
                            ? new Date(user.last_login_at).toLocaleString()
                            : "—"}
                        </td>
                        <td className="py-3 px-5 border">
                          {user.tricycle_number ?? "—"}
                        </td>

                        {/* Barangay Clearance */}
                        <td className="py-3 px-5 border">
                          {user.brgy_clearance ? (
                            <button
                              onClick={() =>
                                openModal(
                                  [user.brgy_clearance],
                                  "Brgy Clearance"
                                )
                              }
                              className="text-blue-600 underline text-sm"
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-gray-400">No File</span>
                          )}
                        </td>

                        {/* Valid ID */}
                        <td className="py-3 px-5 border">
                          {user.valid_id?.front_image ||
                          user.valid_id?.back_image ? (
                            <button
                              onClick={() =>
                                openModal(
                                  [
                                    user.valid_id.front_image,
                                    user.valid_id.back_image,
                                  ],
                                  "Valid ID",
                                  user.valid_id.id_number
                                )
                              }
                              className="text-blue-600 underline text-sm"
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-gray-400">No File</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-5 border">
                          <button
                            onClick={() =>
                              toggleBlock(user.id, user.deleted_at)
                            }
                            className={`px-3 py-1 rounded text-sm ${
                              user.deleted_at
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                          >
                            {user.deleted_at ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PrintToPDF>
          {modalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={closeModal} // Close when backdrop is clicked
            >
              <div
                className="relative bg-white p-6 rounded-lg max-w-lg w-full"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                <h2 className="text-xl font-semibold mb-2 text-black">
                  {modalTitle}
                </h2>

                {modalIdNumber && (
                  <p className="text-sm mb-4 text-gray-600">
                    ID Number: {modalIdNumber}
                  </p>
                )}

                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {modalImages.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Document ${index + 1}`}
                      className="w-full h-auto rounded border"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DriverDispatcherBody;
