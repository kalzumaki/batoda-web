import React from "react";
import Layout from "@/components/Layout";
import DriverDispatcherBody from "@/components/dd_body";
import ReusableHeader from "@/components/ReusableHeader";
const drivers_dispatchers = () => {
  const userType = "president";
  return (
    <Layout userType={userType}>
      <title>DRIVER-DISPATCHER</title>
      <div className="flex-1 overflow-y-auto">
        <ReusableHeader
          title="List of Approved Drivers & Dispatchers"
          subtitle="Manage and view approved Drivers & Dispatchers details in this page."
        />
        <DriverDispatcherBody />
      </div>
    </Layout>
  );
};

export default drivers_dispatchers;
