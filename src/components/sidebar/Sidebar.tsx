"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, MenuItem } from "react-pro-sidebar";
import {
  FaUserTie,
  FaMoneyBillAlt,
  FaChartBar,
  FaCoins,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import Logo from "@/assets/logo.png";
import { menuConfig } from "@/constants/sidebarConfig";

interface SidebarProps {
  userType: string;
}

const CustomSidebar: React.FC<SidebarProps> = ({ userType }) => {
  const [activeItem, setActiveItem] = useState<string>("");

  const handleMenuClick = (item: string) => {
    setActiveItem(item);
  };

  const menuItems = menuConfig[userType] || [];

  return (
    <div className="h-screen">
      <div className="bg-[#3d5554] text-white h-full w-64 flex flex-col">
        <div className="text-center py-5">
        <img src={Logo.src} alt="Logo" className="w-24 mx-auto" />

        </div>

        <div className="flex-1">
          <Menu>
            {menuItems.map((item) => {
              const isActive = activeItem === item.label.toLowerCase();
              return (
                <MenuItem
                  key={item.label}
                  icon={item.icon}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-[#3d5554] bg-white"
                      : "hover:text-[#3d5554] hover:bg-white"
                  }`}
                  onClick={() => handleMenuClick(item.label.toLowerCase())}
                >
                  <Link href={item.path} passHref legacyBehavior>
                    <a className="block w-full h-full">{item.label}</a>
                  </Link>
                </MenuItem>
              );
            })}
          </Menu>
        </div>

        <div className="pb-5">
          <Menu>
            <MenuItem
              icon={<FaSignOutAlt />}
              className={`${
                activeItem === "logout"
                  ? "text-[#3d5554] bg-white"
                  : "hover:text-[#3d5554] hover:bg-white"
              }`}
              onClick={() => handleMenuClick("logout")}
            >
              <Link href="/logout" passHref legacyBehavior>
                <a className="block w-full h-full">Log out</a>
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default CustomSidebar;
