import Layout from "@/components/Layout";
import ReusableHeader from "@/components/ReusableHeader";
import SettingsFare from "@/components/settings_fare";
import SettingsForm from "@/components/settings_form";
import React from "react";

const Settings = () => {
  const userType = "treasurer";
  return (
    <Layout userType={userType}>
      <title>SETTINGS</title>
      <div className="flex-1 overflow-y-auto"></div>
      <ReusableHeader
        title="Settings"
        subtitle="Update your personal details in this page."
      />
      <SettingsForm />
    </Layout>
  );
};

export default Settings;
