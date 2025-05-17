import React, { ReactNode, useState, useEffect } from "react";
import CustomSidebar from "./sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
  userType: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const currentYear = new Date().getFullYear();

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile when component mounts or window resizes to mobile
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar */}
      <CustomSidebar
        userType={userType}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Mobile Menu Toggle Button - visible only when sidebar is closed on mobile */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 p-2 bg-[#3d5554] text-white rounded-md focus:outline-none"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Main content: adjusts based on sidebar */}
      <main
        className={`transition-all duration-300 ease-in-out p-4 bg-white flex-1 overflow-y-auto ${
          isSidebarOpen && !isMobile ? "ml-64" : isMobile ? "ml-0" : "ml-20"
        }`}
      >
        {/* Flex container to push footer to bottom */}
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow pt-10 md:pt-0">{children}</div>
          <footer className="py-4 text-center text-sm text-gray-600">
            &copy; {currentYear} VJBJ. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;
