"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { UpdateUser } from "@/types/user";
import SettingsChangePassword from "./settings_cp";

const SettingsForm = () => {
  const [initialData, setInitialData] = useState<UpdateUser>({});
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingUserData, setPendingUserData] = useState<UpdateUser | null>(
    null
  );
  const [cooldown, setCooldown] = useState<number>(0);
  const [resendingOtp, setResendingOtp] = useState(false);

  const fetchAuthenticatedUser = async () => {
    try {
      const token = Cookies.get("userToken");
      if (!token) {
        toast.error("User token is missing.");
        return;
      }

      const user = await fetch(`/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await user.json();

      if (user.ok && userData.status) {
        const data = userData.data;
        setFname(data.fname || "");
        setLname(data.lname || "");
        setEmail(data.email || "");
        setMobile(data.mobile_number || "");
        setAddress(data.address || "");
        setBirthday(data.birthday || "");
        setGender(data.gender || "");
        setAge(data.age);
        setInitialData({
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          mobile_number: data.mobile_number,
          address: data.address,
          birthday: data.birthday,
          gender: data.gender,
        });
      } else {
        toast.error(userData.message || "Failed to fetch user profile.");
      }
    } catch {
      toast.error("Error fetching user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const token = Cookies.get("userToken");
    if (!token) {
      toast.error("User token is missing.");
      setSubmitting(false);
      return;
    }

    const updatedData: UpdateUser = {
      fname,
      lname,
      email,
      mobile_number: mobile,
      address,
      birthday,
      gender,
    };

    const noChanges = Object.entries(updatedData).every(
      ([key, value]) => value === (initialData as any)[key]
    );

    const emailChanged = email !== initialData.email;

    if (!emailChanged && noChanges) {
      toast.info("No changes made.");
      setSubmitting(false);
      return;
    } else {
      await updateUser(updatedData, token);
      setSubmitting(false);
    }
    if (emailChanged) {
      try {
        const otpRes = await fetch(
          `/api/proxy?endpoint=${ENDPOINTS.UPDATE_EMAIL_SEND_OTP}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email }), // using the correct structure for the payload
          }
        );

        const otpData = await otpRes.json();
        if (otpRes.ok && otpData.status) {
          toast.success("OTP sent to your new email.");
          setShowOtpModal(true);
          setPendingUserData(updatedData); // will be saved after OTP is confirmed
        } else {
          toast.error(otpData.message || "Failed to send OTP.");
        }
      } catch {
        toast.error("Failed to send OTP.");
      } finally {
        setSubmitting(false);
      }

      return;
    }
  };
  const updateUser = async (data: UpdateUser, token: string) => {
    try {
      const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.UPDATE_USER}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.status) {
        toast.success("Profile updated successfully.");
        fetchAuthenticatedUser(); // refresh UI
        setShowOtpModal(false);
      } else {
        toast.error(result.message || "Failed to update profile.");
      }
    } catch {
      toast.error("Something went wrong while updating.");
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    const token = Cookies.get("userToken");
    if (!token) {
      toast.error("User token is missing.");
      return;
    }

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid new email address.");
      return;
    }

    try {
      setResendingOtp(true);

      const otpRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.UPDATE_EMAIL_SEND_OTP}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const otpData = await otpRes.json();

      if (otpRes.ok && otpData.status) {
        toast.success(`OTP sent to ${email}`);
        setCooldown(60);
      } else {
        toast.error(otpData.message || "Failed to resend OTP.");
      }
    } catch {
      toast.error("Error resending OTP.");
    } finally {
      setResendingOtp(false);
    }
  };

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Update Profile
      </h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        {/* First Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
          />
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="text"
            maxLength={11}
            value={mobile}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "");
              if (onlyDigits.length <= 11) setMobile(onlyDigits);
            }}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
            placeholder="e.g. 09123456789"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
          />
        </div>

        {/* Birthday */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d5554] text-black"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Age */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Age</label>
          <input
            type="number"
            value={age ?? ""}
            disabled
            className="p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-600"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-between">
          <SettingsChangePassword />
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#3d5554] text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition duration-200 disabled:opacity-60"
          >
            {submitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            Save Changes
          </button>
        </div>
      </form>
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Enter OTP
            </h3>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3d5554] text-black"
              placeholder="6-digit OTP"
            />
            <p className="text-sm text-gray-600 mb-4">
              Didn’t receive the code?{" "}
              <button
                onClick={resendOtp}
                disabled={cooldown > 0 || resendingOtp}
                className={`font-medium ${
                  cooldown > 0 || resendingOtp
                    ? "text-blue-400 opacity-50 cursor-not-allowed"
                    : "text-blue-600 underline hover:opacity-80"
                }`}
              >
                {resendingOtp ? (
                  <span className="inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin align-middle ml-1"></span>
                ) : cooldown > 0 ? (
                  `Retry in ${cooldown}s`
                ) : (
                  "Retry"
                )}
              </button>
            </p>

            <div className="flex justify-end gap-2">
              <button
                disabled={otp.length !== 6 || submitting}
                onClick={async () => {
                  setSubmitting(true);
                  const token = Cookies.get("userToken");
                  if (!token || !pendingUserData) return;

                  // Proceed to update after OTP is entered
                  await updateUser(pendingUserData, token);
                  setOtp("");
                  setPendingUserData(null);
                }}
                className="bg-[#3d5554] text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsForm;
