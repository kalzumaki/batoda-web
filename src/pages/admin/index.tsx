import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import Sidebar from "@/components/sidebar";
import LineChartComponent from "@/components/LineChart";
import { lineChartData, lineChartOptions } from "@/utils/data/chartData";
import { authenticateUser } from "@/lib/auth";
import { ENDPOINTS } from "../api/endpoints";
import { Box } from "@mui/material";
import CustomSidebar from "@/components/sidebar/Sidebar";
import Layout from "@/components/Layout";
import DBHeader from "@/components/admin/db_header";
const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fname, setFname] = useState("");
  const userType = "admin";

  const handleStartDateChange = (date: Date | null) => {
    console.log("Start Date:", date);
  };

  const handleEndDateChange = (date: Date | null) => {
    console.log("End Date:", date);
  };

  useEffect(() => {
    const token = Cookies.get("userToken");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.push(ENDPOINTS.LOGIN);
    } else {
      try {
        const user = JSON.parse(userData);
        setFname(user.firstName);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push(ENDPOINTS.LOGIN);
      }
      setLoading(false);
    }
  }, []);

  const drawerWidth = 240;

  if (loading) return <div>Loading...</div>;

  return (
    <Layout userType={userType}>
      <DBHeader />
      {/* other content */}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUser(context, [1]);
};

export default AdminDashboard;
