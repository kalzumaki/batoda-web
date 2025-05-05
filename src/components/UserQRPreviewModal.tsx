"use client";

import React from "react";
import { X } from "lucide-react";
import { Officers } from "@/types/user";
import { userManagement } from "@/constants/userTypeMap";
import Image from "next/image";
import logo from "@/assets/logo.png";
interface Props {
  user: Officers;
  onClose: () => void;
}

const UserQRPreviewModal: React.FC<Props> = ({ user, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-xl p-4 w-[400px] max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {/* <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#3d5554] hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button> */}

        {/* ID Card Container */}
        <div className="border-4 border-[#3d5554] rounded-lg p-4 text-center flex flex-col items-center gap-3 min-h-[500px] justify-between bg-gray-50">
          {/* Header with Logo and Title */}
          <div>
            <div className="w-12 h-12 rounded-full mx-auto overflow-hidden">
              <Image
                src={logo}
                alt="BATODA Logo"
                className="object-cover"
                width={48}
                height={48}
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
            <img
              src={user.profile ?? ""}
              onError={(e) =>
                ((e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/100?text=Avatar")
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-[#3d5554] mx-auto"
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
              src={user.qr_code ?? ""}
              alt="QR Code"
              className="w-32 h-32 mx-auto border border-[#3d5554] p-2 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQRPreviewModal;
