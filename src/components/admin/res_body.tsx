"use client";

import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import {
  PassengerReceiptEntry,
  PassengerReceiptResponse,
} from "@/types/reservation";
import FilterBar from "../FilterBar";
import PrintReservationPDF from "../PrintReservationPdf";
import { FiEye } from "react-icons/fi";

const ReservationBody = () => {
  const [passengers, setPassengers] = useState<PassengerReceiptEntry[]>([]);
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sortOrder, setSortOrder] = useState<string>("newest");

  // Function to open the modal with selected seat data
  const openModal = (seats: string[]) => {
    setSelectedSeats(seats);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchUserAndReservations = async () => {
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

        // Fetch reservations
        const reservationRes = await fetch(
          `/api/proxy?endpoint=${ENDPOINTS.GET_RESERVATION_HISTORY}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const reservationData: PassengerReceiptResponse =
          await reservationRes.json();

        if (reservationRes.ok && reservationData.success) {
          setPassengers(reservationData.data);
        } else {
          toast.error(
            reservationData.message || "Failed to fetch reservations"
          );
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndReservations();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <>
      <PrintReservationPDF
        title="Reservation History Report"
        fileName="reservation_report.pdf"
        generatedByFname={fname}
        generatedByLname={lname}
      >
        <div className="rounded-lg shadow overflow-x-auto mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-[#3d5554] bg-white">
              <thead className="bg-[#3d5554] text-white">
                <tr>
                  <th className="py-3 px-5 border text-left">Dispatch No.</th>
                  <th className="py-3 px-5 border text-left">Ticket No.</th>
                  <th className="py-3 px-5 border text-left">Status</th>
                  <th className="py-3 px-5 border text-left">Reference No.</th>
                  <th className="py-3 px-5 border text-left">
                    Seats Available
                  </th>
                  <th className="py-3 px-5 border text-left">Passenger</th>
                  <th className="py-3 px-5 border text-left">Driver</th>
                  <th className="py-3 px-5 border text-left">Tricycle #</th>
                  <th className="py-3 px-5 border text-left">Dispatcher</th>
                  <th className="py-3 px-5 border text-left">Seats</th>
                  <th className="py-3 px-5 border text-left">Fare</th>
                  <th className="py-3 px-5 border text-left">Total</th>
                  <th className="py-3 px-5 border text-left">Payment</th>
                  <th className="py-3 px-5 border text-left">Date</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {loading ? (
                  <tr>
                    <td colSpan={13} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : passengers.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-4">
                      No reservation history found.
                    </td>
                  </tr>
                ) : (
                  passengers.map((item, index) => {
                    const isCancelled = item.ticket_status === "cancelled";
                    return (
                      <tr
                        key={index}
                        className={`transition-colors ${
                          isCancelled
                            ? "bg-red-100 hover:bg-red-200"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <td className="py-3 px-5 border">{item.dispatch_id}</td>
                        <td className="py-3 px-5 border">
                          {item.ticket_number}
                        </td>
                        <td className="py-3 px-5 border capitalize">
                          {item.ticket_status}
                        </td>
                        <td className="py-3 px-5 border">
                          {"reference_no" in item ? item.reference_no : "—"}
                        </td>

                        <td className="py-3 px-5 border">
                          {item.number_of_seats_avail}
                        </td>
                        <td className="py-3 px-5 border">
                          {"passenger_full_name" in item
                            ? item.passenger_full_name
                            : "—"}
                        </td>
                        <td className="py-3 px-5 border">
                          {"driver_full_name" in item
                            ? item.driver_full_name
                            : "—"}
                        </td>
                        <td className="py-3 px-5 border">
                          {"tricycle_number" in item
                            ? item.tricycle_number
                            : "—"}
                        </td>
                        <td className="py-3 px-5 border">
                          {"dispatcher_full_name" in item
                            ? item.dispatcher_full_name
                            : "—"}
                        </td>
                        <td className="py-3 px-5 border w-40 align-top">
                          {/* Screen-only button */}
                          <div className="print:hidden">
                            <button
                              onClick={() =>
                                openModal(
                                  "seat_positions" in item &&
                                    item.seat_positions
                                    ? item.seat_positions.split(", ")
                                    : []
                                )
                              }
                              className="bg-[#3d5554] text-white py-2 px-3 rounded hover:bg-[#2c3f3e] flex items-center justify-center"
                              title="View Seats"
                            >
                              <FiEye className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Print-only seat list */}
                          {"seat_positions" in item && item.seat_positions ? (
                            <ul className="list-disc pl-5 mt-2 hidden print:block text-black">
                              {item.seat_positions
                                .split(", ")
                                .map((seat, index) => (
                                  <li key={index}>{seat}</li>
                                ))}
                            </ul>
                          ) : (
                            <span className="hidden print:block">—</span>
                          )}
                        </td>

                        <td className="py-3 px-5 border">
                          {"passenger_fare" in item
                            ? `${item.passenger_fare}`
                            : "—"}
                        </td>
                        <td className="py-3 px-5 border">
                          {"total_amount" in item
                            ? `${item.total_amount}`
                            : "—"}
                        </td>
                        <td className="py-3 px-5 border">
                          {"payment_method" in item ? item.payment_method : "—"}
                        </td>
                        <td className="py-3 px-5 border w-40 truncate">
                          {"transaction_date" in item
                            ? new Date(item.transaction_date).toLocaleString()
                            : new Date(item.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Custom Modal to display seats */}
          {isModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
              onClick={closeModal}
            >
              <div
                className="bg-white p-6 rounded shadow-lg w-1/3 text-black relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold mb-4">Seat Positions</h2>

                {/* Spinner conditionally shown if seat data is loading */}
                {loading ? (
                  <div className="flex justify-center items-center h-24">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
                  </div>
                ) : (
                  <ul className="list-disc pl-5">
                    {selectedSeats.length > 0 ? (
                      selectedSeats.map((seat, index) => (
                        <li key={index} className="py-1">
                          {seat}
                        </li>
                      ))
                    ) : (
                      <li>No seats available</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </PrintReservationPDF>
    </>
  );
};

export default ReservationBody;
