import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import FilterBar from "../FilterBar";
import PrintToPDF from "../PrintToPdf";
import { Officers } from "@/types/user";
const PassengersBody = () => {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState<Officers[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchUserAndPassengers = async () => {
    try {
      const token = Cookies.get("userToken");

      if (!token) {
        toast.error("User token is missing.");
        return;
      }

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

      // Fetch reservations
      const passenger = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.GET_PASSENGERS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await passenger.json();

      if (passenger.ok && data.status) {
        setPassengers(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch officers.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserAndPassengers();
  }, []);

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
        fetchUserAndPassengers();
      } else {
        throw new Error(data.message || "Action failed.");
      }
    } catch (err: any) {
      console.error("Toggle block error:", err);
      toast.error(err.message);
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
      <PrintToPDF
        title="List of Passengers"
        fileName="passengers-list.pdf"
        buttonLabel="Download Passengers"
        generatedByFname={fname}
        generatedByLname={lname}
      >
        {/* <FilterBar /> */}
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
                <th className="py-3 px-5 border text-left">Status</th>
                <th className="py-3 px-5 border text-left">Last Login</th>
                <th className="py-3 px-5 border text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {passengers.map((passenger) => (
                <tr
                  key={passenger.id}
                  className={`transition-colors ${
                    passenger.deleted_at
                      ? "bg-red-100 hover:bg-red-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <td className="py-3 px-5 border">{passenger.fname}</td>
                  <td className="py-3 px-5 border">{passenger.lname}</td>
                  <td className="py-3 px-5 border">{passenger.email}</td>
                  <td className="py-3 px-5 border">
                    {passenger.mobile_number}
                  </td>
                  <td className="py-3 px-5 border">{passenger.address}</td>
                  <td className="py-3 px-5 border">{passenger.birthday}</td>
                  <td className="py-3 px-5 border">
                    {passenger.is_active ? (
                      <span className="text-green-600 font-medium">Online</span>
                    ) : (
                      <span className="text-red-600 font-medium">Offline</span>
                    )}
                  </td>
                  <td className="py-3 px-5 border">
                    {passenger.last_login_at
                      ? new Date(passenger.last_login_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="py-3 px-5 border">
                    <button
                      onClick={() =>
                        toggleBlock(passenger.id, passenger.deleted_at)
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        passenger.deleted_at
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {passenger.deleted_at ? "Unblock" : "Block"}
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

export default PassengersBody;
