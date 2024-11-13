import React from "react";
import Header from "./Header";
import Body from "./Sidebar";
import MainContent from "./MainContent";
import AdminDashboard from "@/pages/admin";

const Sidebar: React.FC = () => {
  return (
    <>
      <Header />
      <Body />
      {/* <MainContent /> */}
    </>
  );
};

export default Sidebar;
