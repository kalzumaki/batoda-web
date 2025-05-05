import React from "react";

interface ReusableHeaderProps {
  title: string;
  subtitle?: string;
}

const ReusableHeader: React.FC<ReusableHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="text-[#3d5554] text-2xl font-semibold">{title}</div>
      {subtitle && (
        <div className="mt-2 text-[#3d5554] text-sm">{subtitle}</div>
      )}
    </div>
  );
};

export default ReusableHeader;
