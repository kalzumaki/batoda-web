import React from "react";
import Layout from "@/components/Layout";
import UsersBody from "@/components/users_body";
import ReusableHeader from "@/components/ReusableHeader";
const UsersPage = () => {
  const userType = "president";
  return (
    <Layout userType={userType}>
      <title>USERS</title>
      <div className="flex-1 overflow-y-auto">
        <ReusableHeader
          title="Users Approval"
          subtitle="Manage and view new Drivers & Dispatchers details in this section."
        />
        <UsersBody />
      </div>
    </Layout>
  );
};

export default UsersPage;
