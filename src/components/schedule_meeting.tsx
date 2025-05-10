"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ScheduleMeeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scheduledAt || !venue) {
      toast.error("Please fill in all the fields.");
      return;
    }

    try {
      setLoading(true);

      const token = Cookies.get("userToken"); // Assuming your auth token is stored in cookies

      // Making API call using the fetch method, as per your example
      const res = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.NOTIF_MEETING}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scheduled_at: scheduledAt.toISOString(), // Send the date as an ISO string
            venue,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast.success("Meeting scheduled successfully!");
        setIsModalOpen(false); // Close the modal after successful submission
      } else {
        const errorData = await res.json();
        toast.error(errorData?.message || "Failed to schedule the meeting.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while scheduling the meeting.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <button
        onClick={handleToggleModal}
        className="px-4 py-2 bg-[#3d5554] text-white rounded-md hover:bg-[#2c3f3e] transition-all"
      >
        Schedule Meeting
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-semibold text-[#3d5554] mb-4">
              Schedule a Meeting
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scheduled_at" className="block text-gray-700">
                    Scheduled At:
                  </label>
                  <DatePicker
                    id="scheduled_at"
                    selected={scheduledAt}
                    onChange={(date: Date | null) => setScheduledAt(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select a date and time"
                    className="border border-gray-400 text-gray-700 p-2 rounded w-full placeholder-gray-600"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="venue" className="block text-gray-700">
                    Venue:
                  </label>
                  <input
                    id="venue"
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Enter the venue"
                    className="border border-gray-400 p-2 rounded w-full placeholder-gray-600 text-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={handleToggleModal}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3d5554] text-white rounded-md hover:bg-[#2c3f3e]"
                  disabled={loading}
                >
                  {loading ? "Scheduling..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleMeeting;
