import React, { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { BatodaLogs } from "@/types/contribution";
import PrintReservationPDF from "./PrintReservationPdf";
import FilterBar from "./FilterBar";

const FinancesBody = () => {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [logs, setLogs] = useState<BatodaLogs["data"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  const fetchUserAndFinances = async () => {
    try {
      const token = Cookies.get("userToken");
      if (!token) {
        toast.error("User token is missing.");
        return;
      }

      const userRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userData = await userRes.json();
      if (userRes.ok && userData.status) {
        setFname(userData.data.fname);
        setLname(userData.data.lname);
      } else {
        toast.error(userData.message || "Failed to fetch user profile.");
      }

      const logsRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.GET_BATODA_LOGS}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const logsData = await logsRes.json();
      if (logsRes.ok && logsData.status) {
        setLogs(logsData.data);
      } else {
        throw new Error(logsData.message || "Failed to fetch batoda logs.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndFinances();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.driver.toLowerCase().includes(search.toLowerCase()) ||
        log.dispatcher.toLowerCase().includes(search.toLowerCase());

      const logDate = new Date(log.date);
      const isInDateRange =
        (!dateRange.from || logDate >= dateRange.from) &&
        (!dateRange.to || logDate <= dateRange.to);

      return matchesSearch && isInDateRange;
    });
  }, [logs, search, dateRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-[#2d665f] mb-6">
        BATODA Financial Logs
      </h2>

      <FilterBar
        onSearchChange={setSearch}
        onDateRangeChange={setDateRange}
        showDateRange={true}
      />

      <PrintReservationPDF
        fileName="Batoda_Financial_logs.pdf"
        buttonLabel="Download Logs"
        title="Batoda Financial Logs"
        generatedByFname={fname}
        generatedByLname={lname}
      >
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#2d665f] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md text-black">
              <thead className="bg-[#2d665f] text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Driver</th>
                  <th className="px-4 py-2 text-left">Dispatcher</th>
                  <th className="px-4 py-2 text-left">Balance</th>
                  <th className="px-4 py-2 text-left">Dispatcher Fare</th>
                  <th className="px-4 py-2 text-left">Share</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-4 py-2">{log.driver}</td>
                      <td className="px-4 py-2">{log.dispatcher}</td>
                      <td className="px-4 py-2">
                        ₱{parseFloat(log.balance).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        ₱{parseFloat(log.dispatcher_fare).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        ₱{parseFloat(log.dispatcher_share).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">{log.date}</td>
                      <td className="px-4 py-2">{log.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No logs found for selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </PrintReservationPDF>
    </div>
  );
};

export default FinancesBody;
