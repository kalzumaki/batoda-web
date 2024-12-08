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
const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fname, setFname] = useState("");

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
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100%",
          overflow: "auto",
          backgroundColor: "white",
        }}
      >
        <title>Admin Dashboard</title>
        <Box
          sx={{
            mt: 7,
            mb: 2,
            p: 3,
            backgroundColor: "blue",
            borderRadius: "8px",
            color: "white",
            boxShadow: 3,
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
            Welcome Back, {fname}!
          </h3>

        </Box>

        {/* Chart */}
        <Box
          sx={{
            p: 1,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 3,
            height: "400px",
          }}
        >
          <LineChartComponent data={lineChartData} options={lineChartOptions} />
        </Box>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUser(context, [1]);
};

export default AdminDashboard;
