import { MdOutlineDashboard } from "react-icons/md";
import { BsFillPeopleFill, BsFillPersonFill } from "react-icons/bs";
import {
  FaUserTie,
  FaMoneyBillAlt,
  FaChartBar,
  FaCoins,
  FaHistory,
  FaCog,
  FaUserFriends,
  FaListAlt,
} from "react-icons/fa";

export const menuConfig: Record<
  string,
  {
    label: string;
    path: string;
    icon: JSX.Element;
  }[]
> = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: <MdOutlineDashboard /> },
    {
      label: "Users Approval",
      path: "/admin/users",
      icon: <BsFillPersonFill />,
    },
    {
      label: "Drivers & Dispatchers",
      path: "/admin/drivers_dispatchers",
      icon: <FaUserTie />,
    },
    { label: "Officers", path: "/admin/officers", icon: <FaUserFriends /> },
    {
      label: "Passengers",
      path: "/admin/passengers",
      icon: <BsFillPeopleFill />,
    },
    { label: "Reservations", path: "/admin/reservations", icon: <FaListAlt /> },
    {
      label: "Finances",
      path: "/admin/finances",
      icon: <FaMoneyBillAlt />,
    },
    { label: "Reports", path: "/admin/reports", icon: <FaChartBar /> },
    { label: "Settings", path: "/admin/settings", icon: <FaCog /> },
  ],
  //president
  president: [
    { label: "Dashboard", path: "/president", icon: <MdOutlineDashboard /> },
    {
      label: "Users Approval",
      path: "/president/users",
      icon: <BsFillPersonFill />,
    },
    {
      label: "Drivers & Dispatchers",
      path: "/president/drivers_dispatchers",
      icon: <FaUserTie />,
    },
    { label: "Officers", path: "/president/officers", icon: <FaUserFriends /> },
    { label: "Settings", path: "/president/settings", icon: <FaCog /> },
  ],
  secretary: [
    { label: "Dashboard", path: "/secretary", icon: <MdOutlineDashboard /> },
    {
      label: "Reservations",
      path: "/secretary/reservations",
      icon: <FaListAlt />,
    },
    { label: "Reports", path: "/secretary/reports", icon: <FaChartBar /> },
    { label: "Settings", path: "/secretary/settings", icon: <FaCog /> },
  ],
  treasurer: [
    { label: "Dashboard", path: "/treasurer", icon: <MdOutlineDashboard /> },
    {
      label: "Finances",
      path: "/treasurer/finances",
      icon: <FaMoneyBillAlt />,
    },
    { label: "Settings", path: "/treasurer/settings", icon: <FaCog /> },
  ],
  auditor: [
    { label: "Dashboard", path: "/auditor", icon: <MdOutlineDashboard /> },
    {
      label: "Reservations",
      path: "/auditor/reservations",
      icon: <FaListAlt />,
    },
    { label: "Reports", path: "/auditor/reports", icon: <FaChartBar /> },
    { label: "Settings", path: "/auditor/settings", icon: <FaCog /> },
  ],
};
