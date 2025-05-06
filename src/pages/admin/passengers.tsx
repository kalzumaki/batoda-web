import React from 'react'
import Layout from "@/components/Layout";
import ReusableHeader from "@/components/ReusableHeader";
const Passengers = () => {
    const userType = "admin";
  return (
    <Layout userType={userType}>
      <title>Passengers</title>
      <div className="flex-1 overflow-y-auto"></div>
      <ReusableHeader
        title="List of Passengers"
        subtitle="Manage and view Passenger details in this page."
      />
    </Layout>
  )
}

export default Passengers
