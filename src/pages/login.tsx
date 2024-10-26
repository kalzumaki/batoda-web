import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const data = await response.json(); // Always parse response data

      if (response.ok) {
        console.log("Login successful:", data);

        // Check the user type ID
        const userTypeId = data.user.user_type_id; // Adjusted according to your API response

        if (userTypeId >= 1 && userTypeId <= 5) {
          // Store the token in cookies for user types 1-5
          Cookies.set("userToken", data.access_token, { expires: 1 }); // Expires in 1 day
          router.push("/"); // Redirect to a dashboard or home page after successful login
        } else {
          // For user types 6-8 or unexpected user types
          setError(
            "Please log in to the app. Your account is not authorized to access this application."
          );
        }
      } else {
        // Handle unsuccessful response
        setError(
          "Please log in to the app. Your account is not authorized to access this application."
        ); // General message for any failed login attempt
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

          <div className="mb-4">
            <label htmlFor="emailOrMobile" className="block text-black">
              Email or Mobile
            </label>
            <input
              type="text"
              id="emailOrMobile"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-black"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-darkGreen text-white py-2 px-4 rounded-md hover:bg-teal transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
