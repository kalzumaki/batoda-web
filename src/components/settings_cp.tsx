"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";

const SettingsChangePassword = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [email, setEmail] = useState("");
  const handleSendOtp = async () => {
    const token = Cookies.get("userToken");
    if (!token) {
      toast.error("User token is missing.");
      return;
    }

    setSendingOtp(true);

    try {
      const user = await fetch(`/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await user.json();
      if (user.ok && userData.status) {
        const data = userData.data;
        setEmail(data.email || "");
      } else {
        toast.error(userData.message || "Failed to fetch user.");
      }
      const res = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.SEND_OTP_PASSWORD_RESET}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok && data.status) {
        toast.success("OTP sent to your email.");
        setShowOtpModal(true);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch {
      toast.error("Something went wrong while sending OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpSubmit = () => {
    if (otpCode.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    // Example validation; in real case, you'd verify the OTP here
    setShowOtpModal(false);
    setShowPasswordModal(true);
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

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Enter 6-digit OTP
            </h3>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3d5554] text-black tracking-widest text-center"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                className="bg-[#3d5554] text-white px-4 py-2 rounded-md hover:opacity-90"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Change Password
            </h3>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3d5554] text-black"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3d5554] text-black"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3d5554] text-black"
            />

            <div className="flex justify-end gap-2">
              {/* <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button> */}
              <button
                disabled={submitting}
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
    </>
  );
};

export default SettingsChangePassword;
