
import React from 'react';

type AuthButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
};

const AuthButton: React.FC<AuthButtonProps> = ({ label, onClick, variant = 'primary', className = '' }) => {
  const buttonStyle =
    variant === 'primary'
      ? 'bg-darkGreen text-white hover:bg-teal'
      : 'bg-lightGreen text-white hover:bg-teal';

  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-lg shadow transition-all ${buttonStyle} ${className}`}
    >
      {label}
    </button>
  );
};

export default AuthButton;
