import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import { authenticateUser } from "@/lib/auth";
import { ENDPOINTS } from "../api/endpoints";
import Layout from "@/components/Layout";
import DBHeader from "@/components/db_header";
import BatodaLogsChart from "@/components/treasurer/db_batoda_logs";
import Treasurer from "@/components/treasurer/db_treasurer";
const TreasurerDashboard = () => {
  const router = useRouter();
  const [fname, setFname] = useState("");
  const userType = "treasurer";
  useEffect(() => {
    const token = Cookies.get("userToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push(ENDPOINTS.LOGIN);
    } else {
      try {
        const user = JSON.parse(userData);
        setFname(user.firstName);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push(ENDPOINTS.LOGIN);
      }
    }
  }, []);

  return (
    <Layout userType={userType}>
      <title>TREASURER</title>
      <div className="flex-1 overflow-y-auto">
        <DBHeader />
        <BatodaLogsChart />
        <Treasurer />

      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUser(context, [4]);
};

export default TreasurerDashboard;
