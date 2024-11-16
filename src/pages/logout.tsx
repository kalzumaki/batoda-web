import { useEffect } from "react";
import { useRouter } from "next/router";

import { handleLogout } from "@/utils/logout";

const LogoutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    handleLogout(router);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightGray">
      <div className="text-center">
        <svg
          className="animate-spin h-10 w-10 text-teal-600 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-gray-700 font-medium">Signing you out...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
