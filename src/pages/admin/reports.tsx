import React from "react";
import Layout from "@/components/Layout";
import ReusableHeader from "@/components/ReusableHeader";
const Reports = () => {
  const userType = "admin";
  return (
    <Layout userType={userType}>
      <title>REPORTS</title>
      <div className="flex-1 overflow-y-auto"></div>
      <ReusableHeader
        title="Reports"
        subtitle="Generate and view all Report details in this page."
      />
    </Layout>
  );
};

export default Reports;
