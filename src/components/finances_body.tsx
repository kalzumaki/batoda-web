import React, { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import PrintToPDF from "./PrintToPdf";
import FilterBar from "./FilterBar";
import { BatodaLogs } from "@/types/contribution";
const FinancesBody = () => {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [logs, setLogs] = useState<BatodaLogs>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchUserAndFinances = async () => {
    try {
      const token = Cookies.get("userToken");

      if (!token) {
        toast.error("User token is missing.");
        return;
      }

      // Fetch User
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

      // Fetch Batoda Logs
      const logs = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.GET_BATODA_LOGS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const logsData = await logs.json();
      if (logs.ok && logsData.status) {
        setLogs(logsData.data);
      } else {
        throw new Error(logsData.message || "Failed to fetch contribution.");
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

  return <div>FinancesBody</div>;
};

export default FinancesBody;
