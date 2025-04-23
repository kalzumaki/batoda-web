"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ENDPOINTS } from "@/pages/api/endpoints";

const DBHeader = () => {
  const [userName, setUserName] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.USERS_TOKEN}`);
        const result = await res.json();

        if (res.ok && result.status) {
          const data = result.data;
          const { fname, lname, profile } = data;

          setUserName(fname || "User");

          if (profile) {
            const fullImageUrl = `${process.env.NEXT_PUBLIC_API_STORAGE}/storage/${profile}`;
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
        console.error("Failed to fetch user data in DBHeader:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-[#c6d9d7] w-full px-6 py-4 flex items-center justify-between shadow-sm">
      {loading ? (
        <div className="flex items-center justify-center w-full h-12">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-[#3d5554] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {profileImage && (
            <Image
              src={profileImage}
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div className="text-lg font-medium text-gray-800">
            Welcome! {userName}
          </div>
        </div>
      )}
    </div>
  );
};

export default DBHeader;
