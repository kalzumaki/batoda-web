import React, { useState } from "react";
import InputField from "./InputField";
import { PasswordInputFieldProps } from "@/types/passwordInput";
import { FiEye, FiEyeOff } from "react-icons/fi";
const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  label,
  id,
  value,
  onChange,
  required = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <InputField
        label={label}
        type={showPassword ? "text" : "password"}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={className}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute mt-7 mr-2 inset-y-0 right-2 flex items-center text-gray-600"
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );
};
export default PasswordInputField;
