"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { User } from "@/types/user";

const UsersBody: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
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

      const data = await res.json();

      if (data.status) {
        setUsers(data.users);
        setMessage(data.message || "");
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

  const approveUser = async (id: number) => {
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
        await fetchUsers();
      } else {
        toast.error(data.message || "Failed to approve user.");
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

  if (users.length === 0)
    return <p className="text-center text-gray-600 py-4">{message}</p>;

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full table-auto border border-[#3d5554] bg-white">
          <thead className="bg-[#3d5554] text-white">
            <tr>
              <th className="py-3 px-5 border text-left">ID</th>
              <th className="py-3 px-5 border text-left">Full Name</th>
              <th className="py-3 px-5 border text-left">Email</th>
              <th className="py-3 px-5 border text-left">Mobile Number</th>
              <th className="py-3 px-5 border text-left">User Type</th>
              {/* <th className="py-3 px-5 border text-left w-[120px]">
                Tricycle Number
              </th> */}
              <th className="py-3 px-5 border text-left">Email Verified</th>
              <th className="py-3 px-5 border text-left w-[120px]">Valid ID</th>
              <th className="py-3 px-5 border text-left w-[160px]">
                Barangay Clearance
              </th>
              <th className="py-3 px-5 border text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100 transition-colors">
                <td className="py-3 px-5 border">{user.id}</td>
                <td className="py-3 px-5 border">
                  {user.fname} {user.lname}
                </td>
                <td className="py-3 px-5 border">{user.email}</td>
                <td className="py-3 px-5 border">{user.mobile_number}</td>
                <td className="py-3 px-5 border capitalize">
                  {user.user_type.name}
                </td>
                {/* <td className="py-3 px-5 border">
                  {user.tricycle?.tricycle_number
                    ? user.tricycle.tricycle_number
                    : "-"}
                </td> */}
                <td className="py-3 px-5 border">
                  {user.email_verified_at ? "Verified" : "Not Verified"}
                </td>
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
                <td className="py-3 px-5 border">
                  <button
                    onClick={() => approveUser(user.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            {modalIdNumber && (
              <p className="text-center text-gray-700 mb-4">
                ID Number: <span className="font-medium">{modalIdNumber}</span>
              </p>
            )}
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
