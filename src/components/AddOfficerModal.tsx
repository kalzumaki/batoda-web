"use client";

import React, { useState } from "react";
import { ENDPOINTS } from "@/pages/api/endpoints";
import { toast } from "react-toastify";
const AddOfficerModal: React.FC = () => {
  const TemporaryPassword = "Temp@123";
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile_number: "",
    birthday: "",
    address: "",
    gender: "",
    user_type_id: "",
    password: TemporaryPassword,
    password_confirmation: TemporaryPassword,
  });

  const [loading, setLoading] = useState(false);

  const handleToggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/proxy?endpoint=${ENDPOINTS.REGISTER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        handleToggleModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred while registering the officer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleToggleModal}
          className="px-4 py-2 bg-[#3d5554] text-white rounded-md hover:bg-[#2c3f3e] transition-all"
        >
          Add Officer
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-semibold text-[#3d5554] mb-4">
              Register New Officer
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="border border-gray-400 text-gray-700 p-2 rounded w-full placeholder-gray-600"
                />
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="border border-gray-400 p-2 text-black rounded w-full placeholder-gray-600"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="border border-gray-400 p-2 text-gray-700 rounded w-full placeholder-gray-600"
                />
                <input
                  type="number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  maxLength={11}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  required
                  className="border border-gray-400 p-2 text-gray-700 rounded w-full placeholder-gray-600"
                />
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                  className="border border-gray-400 p-2 rounded w-full text-gray-700"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="border border-gray-400 p-2 rounded text-gray-700 w-full col-span-2 placeholder-gray-600"
                />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="border border-gray-400 p-2 rounded w-full col-span-2 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3d5554]"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <select
                  name="user_type_id"
                  value={formData.user_type_id}
                  onChange={handleChange}
                  required
                  className="border border-gray-400 p-2 rounded w-full col-span-2 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3d5554]"
                >
                  <option value="">Select User Type</option>
                  <option value="2">President</option>
                  <option value="3">Secretary</option>
                  <option value="4">Treasurer</option>
                  <option value="5">Auditor</option>
                </select>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Temporary Password:{" "}
                <span className="italic font-medium">{formData.password}</span>
              </p>
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={handleToggleModal}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3d5554] text-white rounded-md hover:bg-[#2c3f3e]"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddOfficerModal;
