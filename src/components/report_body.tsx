"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import FilterBar from "./FilterBar";
import PrintReservationPDF from "./PrintReservationPdf";
import { ReportData, Report } from "@/types/report";

const ReportBody = () => {
  const [report, setReport] = useState<Report | null>(null); // Store full report data
  const [filteredReport, setFilteredReport] = useState<ReportData[]>([]); // Store filtered report data
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch report logic
  const renderReport = async () => {
    try {
      const token = Cookies.get("userToken");
      if (!token) {
        toast.error("User token is missing.");
        return;
      }

      const user = await fetch(`/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await user.json();
      if (user.ok && userData.status) {
        const { fname, lname } = userData.data;
        setFname(fname);
        setLname(lname);
      } else {
        toast.error(userData.message || "Failed to fetch user profile.");
      }

      const report = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.GET_REPORT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const reportData = await report.json();
      if (report.ok && reportData.status) {
        setReport(reportData); // Store full report data
        setFilteredReport(reportData.data); // Set filtered data to all data initially
      } else {
        toast.error("Failed to fetch report data.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    renderReport();
  }, []);

  // Handle date range filter
  const handleDateRangeChange = (range: {
    from: Date | null;
    to: Date | null;
  }) => {
    const { from, to } = range;

    if (from && to) {
      // Filter data based on the date range
      const filteredData = report?.data.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= from && itemDate <= to;
      });
      setFilteredReport(filteredData || []); // Update filtered report
    } else {
      setFilteredReport(report?.data || []); // Reset to full report if no date range
    }
  };

  // Loading spinner while fetching
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );

  // Error message
  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <div className="space-y-4">
      {/* Filter bar component with date range filter */}
      <FilterBar
        onSearchChange={(search) => {}}
        onDateRangeChange={handleDateRangeChange}
        showDateRange={true}
      />

      {/* Print button and table */}
      <PrintReservationPDF
        fileName="batoda_report.pdf"
        title="Batoda Report"
        buttonLabel="Generate Report"
        generatedByFname={fname}
        generatedByLname={lname}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-[#3d5554] bg-white">
            <thead className="bg-[#3d5554] text-white">
              <tr>
                <th className="py-3 px-5 border text-left">Dispatch ID</th>
                <th className="py-3 px-5 border text-left">Passenger Count</th>
                <th className="py-3 px-5 border text-left truncate">
                  Scheduled Dispatch
                </th>
                <th className="py-3 px-5 border text-left truncate">
                  Actual Dispatch
                </th>
                <th className="py-3 px-5 border text-left">Dispatcher</th>
                <th className="py-3 px-5 border text-left w-64">
                  Dispatcher Fare & Share
                </th>

                <th className="py-3 px-5 border text-left w-52">Driver</th>
                <th className="py-3 px-5 border text-left truncate">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="text-black">
              {filteredReport.map((dispatch) => (
                <tr key={dispatch.dispatch_id} className="hover:bg-gray-100">
                  <td className="py-3 px-5 border">{dispatch.dispatch_id}</td>
                  <td className="py-3 px-5 border">
                    {dispatch.passenger_count}
                  </td>
                  <td className="py-3 px-5 border">
                    {dispatch.scheduled_dispatch_time}
                  </td>
                  <td className="py-3 px-5 border">
                    {dispatch.actual_dispatch_time ?? "N/A"}
                  </td>
                  <td className="py-3 px-5 border">
                    {`${dispatch.dispatcher?.name || "N/A"} (${
                      dispatch.dispatcher?.email || "N/A"
                    })`}
                  </td>
                  <td className="py-3 px-5 border">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Total Fare:{" "}
                        {dispatch.dispatcher?.total_collected_fare
                          ? dispatch.dispatcher.total_collected_fare
                              .toFixed(2)
                              .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                          : "N/A"}
                      </li>
                      <li>
                        Dispatcher Share:{" "}
                        {dispatch.dispatcher?.dispatcher_share
                          ? dispatch.dispatcher.dispatcher_share
                              .toFixed(2)
                              .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                          : "N/A"}
                      </li>
                      <li>
                        Batoda Share:{" "}
                        {dispatch.dispatcher?.batoda_share
                          ? dispatch.dispatcher.batoda_share
                              .toFixed(2)
                              .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                          : "N/A"}
                      </li>
                    </ul>
                  </td>

                  <td className="py-3 px-5 border">
                    {`${dispatch.driver?.name || "N/A"} (${
                      dispatch.driver?.email || "N/A"
                    })
                    Tricycle: ${dispatch.driver?.tricycle_number || "N/A"}`}
                  </td>
                  <td className="py-3 px-5 border">{dispatch.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PrintReservationPDF>
    </div>
  );
};

export default ReportBody;
