import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";

const PresidentDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("userToken");
    console.log(token);
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <h1>President Dashboard</h1>
      {/* Dashboard content here */}
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



  return {
    props: {},
  };
};

export default PresidentDashboard;
