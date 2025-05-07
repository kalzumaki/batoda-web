"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SettingsChangePassword = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Send OTP
  const handleSendOtp = async () => {
    const token = Cookies.get("userToken");
    if (!token) return toast.error("User token is missing.");

    setSendingOtp(true);

    try {
      // Fetch user info to get email
      const userRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = await userRes.json();
      if (!userRes.ok || !userData.status) {
        throw new Error(userData.message || "Failed to get user info.");
      }

      const userEmail = userData.data.email;
      setEmail(userEmail);

      // Send OTP to user's email
      const otpRes = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.SEND_OTP_PASSWORD_RESET}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        }
      );

      const otpData = await otpRes.json();
      if (!otpRes.ok || !otpData.status) {
        throw new Error(otpData.message || "Failed to send OTP.");
      }

      toast.success("OTP sent to your email.");
      setShowOtpModal(true);
    } catch (error: any) {
      toast.error(error.message || "Error sending OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Submit OTP + New Password
  const handlePasswordSubmit = async () => {
    if (otpCode.length !== 6) return toast.error("OTP must be 6 digits.");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match.");

    const token = Cookies.get("userToken");
    if (!token) return toast.error("User token is missing.");

    setSubmitting(true);

    try {
      const res = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.VERIFY_OTP_FOR_PASSWORD_RESET}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpCode,
            password: newPassword,
            password_confirmation: confirmPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.error || "Password reset failed.");
      }

      toast.success("Password changed successfully.");
      setShowOtpModal(false);
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Error resetting password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSendOtp}
        disabled={sendingOtp}
        className="bg-[#3d5554] text-white text-sm font-medium px-4 py-1.5 rounded-md shadow-sm hover:opacity-90 transition flex items-center gap-2 disabled:opacity-60"
      >
        {sendingOtp && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        Change Password
      </button>

      {/* OTP & Password Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Enter OTP & New Password
            </h3>
            <input value={email} hidden />
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md text-center tracking-widest text-black"
            />
            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={submitting}
                className="bg-[#3d5554] text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsChangePassword;
