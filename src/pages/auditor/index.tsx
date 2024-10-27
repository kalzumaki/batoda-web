import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";

const AuditorDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("userToken");
    console.log(token);
    if (!token) {
      router.push("/login"); // Redirect to login if no token is found
    }
  }, [router]);

  return (
    <div>
      <h1>Auditor Dashboard</h1>
      {/* Dashboard content here */}
    </div>
  );
};

// Server-side authentication check
export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.userToken;

  if (!token) {
    // Redirect to login page if no token
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Optionally, you can verify the token with your API to ensure validity here

  return {
    props: {}, // Pass any data as props if needed
  };
};

export default AuditorDashboard;
