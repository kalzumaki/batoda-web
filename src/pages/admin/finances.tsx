import React from "react";
import Layout from "@/components/Layout";
import ReusableHeader from "@/components/ReusableHeader";
import FinancesSubHeader from "@/components/finances_subheader";
import FinancesBody from "@/components/finances_body";
const Finances = () => {
  const userType = "admin";
  return (
    <Layout userType={userType}>
      <title>FINANCES</title>
      <div className="flex-1 overflow-y-auto"></div>
      <ReusableHeader
        title="Finances"
        subtitle="View all Finances details in this page."
      />
      <FinancesSubHeader />
      <FinancesBody />
    </Layout>
  );
};

export default Finances;
