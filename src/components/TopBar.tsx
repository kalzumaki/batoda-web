// src/components/Topbar.tsx
import React from 'react';
import AuthButton from './AuthButton';
import { useRouter } from 'next/router';

const Topbar: React.FC = () => {
    const router = useRouter();
    const handleLogin = () => {
        router.push('/login'); // Redirects to the login page
      };
  const handleRegister = () => {
    console.log("Register clicked");
    // Add register functionality here
  };

  return (
    <div className="flex justify-end items-center p-4 bg-lightTeal">
      <AuthButton label="Login" onClick={handleLogin} variant="primary" />
      <AuthButton label="Register" onClick={handleRegister} variant="secondary" className="ml-4" />
    </div>
  );
};

export default Topbar;
