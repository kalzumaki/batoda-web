"use client";

import React from "react";
import { Officers } from "@/types/user";
import { userManagement } from "@/constants/userTypeMap";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Avatar from "@mui/material/Avatar";
import PrintID from "./PrintId";

interface Props {
  user: Officers;
  onClose: () => void;
}

const UserQRPreviewModal: React.FC<Props> = ({ user, onClose }) => {
  const isFullUrl = (url: string) => /^https?:\/\//i.test(url);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_STORAGE?.replace(/\/+$/, "") || "";

  const getImageUrl = (path?: string | null) => {
    if (!path) return "";
    if (isFullUrl(path)) {
      return `/api/image-proxy?url=${encodeURIComponent(path)}`;
    }
    const cleanedPath = path.replace(/^\/+/, "").replace(/^storage\//, "");
    const rawUrl = `${baseUrl}/storage/${cleanedPath}`;
    return `/api/image-proxy?url=${encodeURIComponent(rawUrl)}`;
  };

  const profileUrl = getImageUrl(user.profile);
  const qrCodeUrl = getImageUrl(user.qr_code);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-xl p-4 w-[400px] max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ID Card Container */}
        <PrintID buttonLabel="Print">
          <div className="border-4 border-[#3d5554] rounded-lg p-4 text-center flex flex-col items-center gap-3 min-h-[500px] justify-between bg-gray-50">
            {/* Header with Logo and Title */}
            <div>
              <div className="w-20 h-20 rounded-full mx-auto overflow-hidden">
                <Image
                  src={logo}
                  alt="BATODA Logo"
                  className="object-cover"
                  width={100}
                  height={100}
                />
              </div>

              <h1 className="text-sm font-semibold uppercase text-[#3d5554] leading-tight mt-1">
                Bacong Tricycle Operators
                <br />
                and Drivers Associations
              </h1>
            </div>

            {/* Profile Image */}
            <div>
              <Avatar
                alt="Profile"
                src={profileUrl}
                sx={{ width: 96, height: 96, margin: "0 auto" }}
              />
            </div>

            {/* User Info */}
            <div>
              <p className="text-base text-[#3d5554] font-medium">Hi I'm</p>
              <h2 className="text-xl font-bold text-[#3d5554]">
                {user.fname} {user.lname}
              </h2>
              <p className="text-sm font-semibold text-[#3d5554] mt-1">
                BATODA {userManagement[user.user_type_id]}
              </p>
            </div>

            {/* QR Code */}
            <div>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-32 h-32 mx-auto border border-[#3d5554] p-2 bg-white"
              />
            </div>
          </div>
        </PrintID>
      </div>
    </div>
  );
};

export default UserQRPreviewModal;
