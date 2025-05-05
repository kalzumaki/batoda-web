import React from "react";
import Layout from "@/components/Layout";
import ReusableHeader from "@/components/ReusableHeader";

const Reservations = () => {
  const userType = "admin";
  return (
    <Layout userType={userType}>
      <title>RESERVATIONS</title>
      <div className="flex-1 overflow-y-auto"></div>
      <ReusableHeader
        title="Reservations"
        subtitle="View all seats and reservations details in this page."
      />
    </Layout>
  );
};

export default Reservations;
