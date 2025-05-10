"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { Fare, UpdateFarePayload } from "@/types/fare";

const SettingsFare = () => {
  const [fare, setFare] = useState<Fare | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const [farePayload, setFarePayload] = useState<UpdateFarePayload>({
    seat_fare: 0,
    dispatcher_fare: 0,
    dispatcher_share_percent: 0,
    batoda_share_percent: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const token = Cookies.get("userToken");

  useEffect(() => {
    fetchFare();
  }, []);

  const fetchFare = async () => {
    try {
      const userRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = await userRes.json();
      if (!userRes.ok || !userData.status) {
        throw new Error(userData.message || "Failed to get user info.");
      }

      const role = parseInt(userData.data.user_type_id);
      setRole(role);

      if (role !== 1 && role !== 2) return;

      const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_FARE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Fare = await res.json();
      if (res.ok && data.status) {
        setFare(data);
        setFarePayload({
          seat_fare: parseFloat(data.data.passenger_fare),
          dispatcher_fare: parseFloat(data.data.dispatcher_fare),
          dispatcher_share_percent: data.data.dispatcher_share_percent,
          batoda_share_percent: data.data.batoda_share_percent,
        });
      } else {
        toast.error(
          data?.status ? "Invalid data format" : "Failed to fetch fare"
        );
      }
    } catch (err) {
      toast.error("Error fetching fare data.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFarePayload((prev) => ({
      ...prev,
      [name]: name.includes("percent") ? parseInt(value) : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      seat_fare,
      dispatcher_fare,
      dispatcher_share_percent,
      batoda_share_percent,
    } = farePayload;

    if (dispatcher_share_percent + batoda_share_percent !== 100) {
      toast.error("Dispatcher and Batoda share must add up to 100%");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.UPDATE_FARE}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(farePayload),
      });

      const result = await res.json();

      if (res.ok && result.status) {
        toast.success("Fare updated successfully");
        fetchFare(); 
      } else {
        toast.error(result.error || "Failed to update fare");
      }
    } catch (err) {
      toast.error("Error updating fare");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );

  if (role !== 1 && role !== 2) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Fare Settings
      </h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Passenger Fare
          </label>
          <input
            type="number"
            name="seat_fare"
            value={farePayload.seat_fare}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
            step="0.01"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Dispatcher Fare
          </label>
          <input
            type="number"
            name="dispatcher_fare"
            value={farePayload.dispatcher_fare}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
            step="0.01"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Dispatcher Share %
          </label>
          <select
            name="dispatcher_share_percent"
            value={farePayload.dispatcher_share_percent}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
          >
            {[...Array(11)].map((_, index) => {
              const value = index * 10;
              return (
                <option key={value} value={value}>
                  {value}%
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Batoda Share %
          </label>
          <select
            name="batoda_share_percent"
            value={farePayload.batoda_share_percent}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
          >
            {[...Array(11)].map((_, index) => {
              const value = index * 10;
              return (
                <option key={value} value={value}>
                  {value}%
                </option>
              );
            })}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3d5554] text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition duration-200 disabled:opacity-60"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            Update Fare
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsFare;
