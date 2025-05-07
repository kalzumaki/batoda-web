import React from "react";
import Layout from "@/components/Layout";
import ReusableHeader from "@/components/ReusableHeader";
import ReservationBody from "@/components/res_body";

const Reservations = () => {
  const userType = "secretary";
  return (
    <Layout userType={userType}>
      <title>RESERVATIONS</title>
      <div className="flex-1 overflow-y-auto"></div>
      <ReusableHeader
        title="Reservations"
        subtitle="View all seats and reservations details in this page."
      />
      <ReservationBody />
    </Layout>
  );
};

export default Reservations;
