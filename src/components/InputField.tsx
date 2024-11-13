import React from "react";
import { InputFieldProps } from "@/types/inputField";

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  id,
  value,
  onChange,
  className = "",
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-black">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-black ${className}`}
      />
    </div>
  );
};

export default InputField;
