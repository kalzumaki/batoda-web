"use client";

import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react"; // You can swap with any icon lib

interface uploadProfile {
  profile: File;
}

const SettingsUploadProfile = () => {
  const [profileImage, setProfileImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`);
        const result = await res.json();

        if (res.ok && result.status) {
          const data = result.data;
          const { fname, lname, profile } = data;

          if (profile) {
            const fullImageUrl = `${process.env.NEXT_PUBLIC_API_STORAGE}storage/${profile}`;
            if (
              fullImageUrl.startsWith("http://") ||
              fullImageUrl.startsWith("https://")
            ) {
              setProfileImage(fullImageUrl);
            } else {
              setProfileImage(`${process.env.API_STORAGE}/${profile}`);
            }
          } else {
            const fullName = `${fname} ${lname}`;
            const encodedName = encodeURIComponent(fullName);
            setProfileImage(
              `https://avatar.iran.liara.run/username?username=${encodedName}`
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file));
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("profile", file); // use the passed file directly

    try {
      setUploading(true);
      const token = Cookies.get("userToken");

      const res = await fetch(
        `/api/proxy?endpoint=${ENDPOINTS.UPDATE_PROFILE_PIC}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const result = await res.json();
      console.log("Uploading file:", file);
      console.log("FormData keys:", [...formData.entries()]);

      if (res.ok && result.status) {
        toast.success(result.message);
        // Optional: update image with new profile path from server if provided
        if (result.profile) {
          setProfileImage(
            `${process.env.NEXT_PUBLIC_API_STORAGE}storage/${result.profile}`
          );
        }
      } else {
        toast.error(result.error || result.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center py-3">
      <div className="relative">
        {loading ? (
          <div className="w-28 h-28 rounded-full bg-gray-300 animate-pulse" />
        ) : (
          <>
            <img
              src={profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 shadow-md"
            />
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-blue-100 transition"
              title="Update Profile Picture"
            >
              <Pencil className="w-4 h-4 text-blue-600" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsUploadProfile;
