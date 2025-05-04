import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ENDPOINTS } from "@/pages/api/endpoints";

let isLoggingOut = false;

export const handleLogout = async (router: ReturnType<typeof useRouter>) => {
  if (isLoggingOut) {
    console.log("Logout already in progress. Skipping...");
    return;
  }

  isLoggingOut = true;
  console.log("Logout started...");

  try {
    const response = await fetch(`/api/proxy?endpoint=${ENDPOINTS.LOGOUT}`, {
      method: "POST",
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Logout successful");
      localStorage.removeItem("user");

      router.push(ENDPOINTS.LOGIN);
    } else {
      console.log("Logout failed:", response.status);
      const errorData = await response.json();
      console.error("Logout failed details:", errorData);
      toast.error(errorData.error || "Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("An error occurred during logout. Please try again.", {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    isLoggingOut = false;
  }
};
