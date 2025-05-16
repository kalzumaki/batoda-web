import React, { ReactNode, useState } from "react";
import CustomSidebar from "./sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
  userType: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full z-40">
        <CustomSidebar
          userType={userType}
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      </div>

      {/* Main content: adjusts based on sidebar */}
      <main
        className={`transition-all duration-300 ease-in-out p-4 bg-white flex-1 overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Flex container to push footer to bottom */}
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">{children}</div>
          <footer className="py-4 text-center text-sm text-gray-600">
            &copy; {currentYear} VJBJ. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;
