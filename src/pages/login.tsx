import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import InputField from "@/components/InputField";
import PasswordInputField from "@/components/PasswordInputField";
import { LoginResponse } from "@/types/login";

const LoginPage: React.FC = () => {
  const [emailOrMobile, setEmailOrMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("emailOrMobile") || "";
    setEmailOrMobile(savedEmail);
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

    try {
      const response = await fetch(`/api/proxy?endpoint=/login`, {
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

      if (response.ok) {
        console.log("Login successful:", data);

        setLoginAttempts(0);
        Cookies.set("userToken", data.access_token, { expires: 1 });

        const userRoutes: { [key: number]: string } = {
          1: "/admin",
          2: "/president",
          3: "/secretary",
          4: "/treasurer",
          5: "/auditor",
        };

        const userTypeId = data.user.user_type_id;
        if (userRoutes[userTypeId]) {
          router.push(userRoutes[userTypeId]);
        } else {
          setError(
            "Your account is not authorized to access this application."
          );
        }
      } else {
        setLoginAttempts((prevAttempts) => prevAttempts + 1);
        setError(data.message || "Invalid credentials. Please try again.");

        if (loginAttempts + 1 >= 3) {
          setRetryAfter(60);
          setError(
            "You've reached the maximum attempts. Please wait 60 seconds."
          );
        }
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <title>LOGIN</title>
      <div className="min-h-screen flex items-center justify-center bg-lightTeal">
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
            className="w-full bg-darkGreen text-white py-2 px-4 rounded-md hover:bg-teal transition-all"
            disabled={retryAfter !== null && retryAfter > 0}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
