"use client";

import React from "react";
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

  return (
    <div
      className={`bg-[#3d5554] text-white flex flex-col transition-all duration-300 ease-in-out h-full relative ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Toggle button */}
      <div className="absolute top-4 w-full px-2">
        <button
          onClick={toggleSidebar}
          className={`text-white text-3xl focus:outline-none ${
            isOpen ? "float-right" : "flex justify-center w-full"
          }`}
        >
          {isOpen ? <IoMdClose /> : <HiMenu />}
        </button>
      </div>

      {/* Logo */}
      <div className="text-center py-16">
        {isOpen && <img src={Logo.src} alt="Logo" className="w-24 mx-auto" />}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        <Menu>
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              icon={item.icon}
              onClick={() => router.push(item.path)}
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
            onClick={() => router.push("/logout")}
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
  );
};

export default CustomSidebar;
