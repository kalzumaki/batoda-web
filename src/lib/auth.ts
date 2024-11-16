import { ENDPOINTS } from "@/pages/api/endpoints";
import { GetServerSidePropsContext } from "next";

export const authenticateUser = async (
  context: GetServerSidePropsContext,
  allowedRoles: number[]
) => {
  const token = context.req.cookies.userToken;

  if (!token) {
    return {
      redirect: {
        destination: ENDPOINTS.LOGIN,
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(`${process.env.API_ENDPOINT}${ENDPOINTS.VALIDATE_TOKEN}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        redirect: {
          destination: ENDPOINTS.LOGIN,
          permanent: false,
        },
      };
    }

    const userData = await response.json();

    if (!allowedRoles.includes(userData.user_type_id)) {
      return {
        redirect: {
          destination: ENDPOINTS.UNAUTHORIZED,
          permanent: false,
        },
      };
    }

    return { props: { userData } };
  } catch (error) {
    console.error("Error validating token:", error);
    return {
      redirect: {
        destination: ENDPOINTS.LOGIN,
        permanent: false,
      },
    };
  }
};
