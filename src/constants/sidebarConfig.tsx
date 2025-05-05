import { MdOutlineDashboard } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import {
  FaUserTie,
  FaMoneyBillAlt,
  FaChartBar,
  FaCoins,
  FaHistory,
  FaCog,
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
    { label: "Users Approval", path: "/admin/users", icon: <BsFillPersonFill /> },
    { label: "Drivers & Dispatchers", path: "/admin/drivers_dispatchers", icon: <FaUserTie /> },
    // { label: "Finances", path: "/finances", icon: <FaMoneyBillAlt /> },
    { label: "Report", path: "/report", icon: <FaChartBar /> },
    {
      label: "Fare & Contribution",
      path: "/fare-contribution",
      icon: <FaCoins />,
    },
    { label: "History", path: "/history", icon: <FaHistory /> },
    { label: "Settings", path: "/settings", icon: <FaCog /> },
  ],
  president: [
    { label: "Dashboard", path: "/index", icon: <MdOutlineDashboard /> },
    { label: "Report", path: "/report", icon: <FaChartBar /> },
    { label: "Finances", path: "/finances", icon: <FaMoneyBillAlt /> },
  ],
  secretary: [
    { label: "Drivers", path: "/drivers", icon: <BsFillPersonFill /> },
    { label: "Dispatcher", path: "/dispatcher", icon: <FaUserTie /> },
    { label: "Settings", path: "/settings", icon: <FaCog /> },
  ],
  treasurer: [
    { label: "Finances", path: "/finances", icon: <FaMoneyBillAlt /> },
    {
      label: "Fare & Contribution",
      path: "/fare-contribution",
      icon: <FaCoins />,
    },
  ],
  auditor: [
    { label: "History", path: "/history", icon: <FaHistory /> },
    { label: "Report", path: "/report", icon: <FaChartBar /> },
  ],
};
