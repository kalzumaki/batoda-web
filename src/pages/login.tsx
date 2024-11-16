import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "@/components/InputField";
import PasswordInputField from "@/components/PasswordInputField";
import { LoginResponse } from "@/types/login";
import { ENDPOINTS } from "./api/endpoints";

const LoginPage: React.FC = () => {
  const [emailOrMobile, setEmailOrMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("emailOrMobile") || "";
    setEmailOrMobile(savedEmail);

    const token = Cookies.get("userToken");
    if (token) {
      redirectToRoleBasedRoute();
    }
  }, []);

  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const countdownInterval = setInterval(() => {
        setRetryAfter((prevRetryAfter) =>
          prevRetryAfter ? prevRetryAfter - 1 : 0
        );
      }, 1000);

      if (retryAfter === 1) {
        setLoginAttempts(0);
        setRetryAfter(null);
        setError("");
      }

      return () => clearInterval(countdownInterval);
    }
  }, [retryAfter]);

  const redirectToRoleBasedRoute = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { user_type_id } = JSON.parse(storedUser);
      const userRoutes: { [key: number]: string } = {
        1: "/admin",
        2: "/president",
        3: "/secretary",
        4: "/treasurer",
        5: "/auditor",
      };
      if (userRoutes[user_type_id]) {
        router.push(userRoutes[user_type_id]).then(() => {
          setIsLoading(false);
          toast.success("Logged in successfully!");
        });
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmailOrMobile(value);
    sessionStorage.setItem("emailOrMobile", value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginAttempts >= 3) {
      setError("You've reached the maximum attempts. Please wait.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/proxy?endpoint=${ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_or_mobile: emailOrMobile,
          password: password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.status) {
        setLoginAttempts(0);
        Cookies.set("userToken", data.access_token, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            firstName: data.user.fname,
            lastName: data.user.lname,
            email: data.user.email,
            user_type_id: data.user.user_type_id,
          })
        );

        redirectToRoleBasedRoute();
      } else {
        setLoginAttempts((prevAttempts) => prevAttempts + 1);
        toast.error(data.message || "Invalid credentials. Please try again.");

        if (loginAttempts + 1 >= 3) {
          setRetryAfter(60);
          setError(
            "You've reached the maximum attempts. Please wait 60 seconds."
          );
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>LOGIN</title>
      <div className="min-h-screen flex items-center justify-center bg-lightTeal">
        <ToastContainer position="top-right" autoClose={5000} />
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <h2 className="text-2xl font-semibold text-black mb-6 text-center">
            Login
          </h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {loginAttempts > 0 && loginAttempts < 3 && (
            <p className="text-red-500 mb-4">
              Attempts remaining: {3 - loginAttempts}
            </p>
          )}

          {retryAfter !== null && retryAfter > 0 && (
            <p className="text-red-500 mb-4">
              Please wait {retryAfter} seconds before retrying.
            </p>
          )}

          <InputField
            label="Email or Mobile"
            id="emailOrMobile"
            value={emailOrMobile}
            onChange={handleInputChange}
            required
          />

          <PasswordInputField
            label="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-darkGreen text-white py-2 px-4 rounded-md hover:bg-teal transition-all flex items-center justify-center"
            disabled={(retryAfter !== null && retryAfter > 0) || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
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
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
