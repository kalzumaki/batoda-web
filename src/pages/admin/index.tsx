import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import Sidebar from "@/components/sidebar";

const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("userToken");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
        <title>Admin</title>
      <Sidebar />

      <h1>Admin</h1>
    </div>
  );
};

// Server-side authentication check
export const getServerSideProps: GetServerSideProps = async (context) => {
    const token = context.req.cookies.userToken;

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/validate-token`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      const userData = await response.json();

      if (userData.user_type_id !== 1) {
        return {
          redirect: {
            destination: "/unauthorized",
            permanent: false,
          },
        };
      }

      return { props: { userData } };
    } catch (error) {
      console.error("Error validating token:", error);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };

export default AdminDashboard;
