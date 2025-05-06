import Layout from "@/components/Layout";
import ReusableHeader from "@/components/ReusableHeader";
import React from "react";

const Settings = () => {
  const userType = "admin";
  return (
    <Layout userType={userType}>
      <title>SETTINGS</title>
      <div className="flex-1 overflow-y-auto"></div>
      <ReusableHeader
        title="Settings"
        subtitle="Update your personal details in this page."
      />
    </Layout>
  );
};

export default Settings;
