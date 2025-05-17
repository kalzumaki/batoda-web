"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, MenuItem } from "react-pro-sidebar";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { HiMenu } from "react-icons/hi";
import Logo from "@/assets/logo.png";
import { menuConfig } from "@/constants/sidebarConfig";

interface SidebarProps {
  userType: string;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const CustomSidebar: React.FC<SidebarProps> = ({
  userType,
  isOpen,
  toggleSidebar,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = menuConfig[userType] || [];
  const isActivePath = (path: string) => pathname === path;
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div
      className={`bg-[#3d5554] text-white flex flex-col transition-all duration-300 ease-in-out h-full fixed z-50 ${
        isOpen
          ? isMobile
            ? "w-64"
            : "w-64"
          : isMobile
          ? "w-0 overflow-hidden"
          : "w-20"
      }`}
    >
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`relative flex flex-col h-full z-40 ${
          isMobile && isOpen ? "w-full" : "w-full"
        }`}
      >
        {/* Toggle button */}
        <div className="absolute top-4 right-4 flex justify-end">
          <button
            onClick={toggleSidebar}
            className="text-white text-3xl focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <HiMenu /> : <HiMenu />}
          </button>
        </div>

        {/* Logo */}
        <div className="text-center py-5 mt-4">
          {isOpen && <img src={Logo.src} alt="Logo" className="w-20 mx-auto" />}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto mt-2">
          <Menu>
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                icon={item.icon}
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) toggleSidebar(); // Close sidebar after navigation on mobile
                }}
                className={`transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? "text-[#3d5554] bg-white"
                    : "hover:text-[#3d5554] hover:bg-white"
                }`}
              >
                {isOpen ? item.label : ""}
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* Logout */}
        <div className="pb-5">
          <Menu>
            <MenuItem
              icon={<FaSignOutAlt />}
              onClick={() => {
                router.push("/logout");
                if (isMobile) toggleSidebar(); // Close sidebar after logout on mobile
              }}
              className={`transition-colors duration-200 ${
                isActivePath("/logout")
                  ? "text-[#3d5554] bg-white"
                  : "hover:text-[#3d5554] hover:bg-white"
              }`}
            >
              {isOpen ? "Log out" : ""}
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default CustomSidebar;
