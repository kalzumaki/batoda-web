import React, { ReactNode } from "react";
import CustomSidebar from "./sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
  userType: string; // Accepts user type like "admin", "secretary", etc.
}

const Layout: React.FC<LayoutProps> = ({ children, userType }) => {
  return (
    <div className="flex">
      <CustomSidebar userType={userType} />
      <main className="flex-1 bg-gray-100 min-h-screen p-4">{children}</main>
    </div>
  );
};

export default Layout;
