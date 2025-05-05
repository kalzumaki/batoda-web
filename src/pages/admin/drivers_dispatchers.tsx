import React from "react";
import Layout from "@/components/Layout";
import DriverDispatcherHeader from "@/components/admin/dd_header";
import DriverDispatcherBody from "@/components/admin/dd_body";
const drivers_dispatchers = () => {
  const userType = "admin";
  return (
    <Layout userType={userType}>
      <title>DRIVER-DISPATCHER</title>
      <div className="flex-1 overflow-y-auto">
        <DriverDispatcherHeader />
        <DriverDispatcherBody />
      </div>
    </Layout>
  );
};

export default drivers_dispatchers;
