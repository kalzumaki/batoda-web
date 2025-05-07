import React from "react";
import Layout from "@/components/Layout";
import ReusableHeader from "@/components/ReusableHeader";
import OfficersBody from "@/components/off_body";
const Officers = () => {
  const userType = "president";
  return (
    <Layout userType={userType}>
      <title>OFFICERS</title>
      <div className="flex-1 overflow-y-auto"></div>
      <ReusableHeader
        title="List of Officers"
        subtitle="Manage and view officers details in this page."
      />
      <OfficersBody />
    </Layout>
  );
};

export default Officers;
