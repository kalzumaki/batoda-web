import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import { authenticateUser } from "@/lib/auth";
import { ENDPOINTS } from "../api/endpoints";
import Layout from "@/components/Layout";
import DBHeader from "@/components/db_header";
import DbBody from "@/components/admin/db_body";
import DbChart from "@/components/db_chart";

const AdminDashboard = () => {
  const router = useRouter();

  const [fname, setFname] = useState("");
  const userType = "admin";

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
      <title> ADMIN</title>
      <div className="flex-1 overflow-y-auto">
        <DBHeader />
        <DbBody />
        <DbChart />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUser(context, [1]);
};

export default AdminDashboard;
