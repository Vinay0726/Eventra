import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiPhone,
  FiLock,
  FiCheck,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import api from "../../api/axios";

const OrgUpdateProfile = () => {
  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = currentUser.id;
  const role = currentUser.role || "organizer";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/auth/organizer/${userId}`);
        setFormData((prev) => ({
          ...prev,
          name: res.data.name || "",
          mobile: res.data.mobile || "",
          email: res.data.email || "",
        }));
      } catch (err) {
        console.error("Failed to fetch organizer profile", err);
        setMessage("❌ Failed to fetch profile");
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const isPasswordUpdate =
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword;

    if (isPasswordUpdate) {
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        setMessage("❌ Please fill all password fields to update password.");
        setLoading(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setMessage("❌ New password and confirm password do not match.");
        setLoading(false);
        return;
      }
    }

    const payload = {};
    if (formData.name.trim()) payload.name = formData.name.trim();
    if (formData.mobile.trim()) payload.mobile = formData.mobile.trim();
    // Email updates are optional; only include if changed
    if (formData.email.trim() && formData.email !== currentUser.email)
      payload.email = formData.email.trim();
    if (formData.currentPassword)
      payload.currentPassword = formData.currentPassword;
    if (formData.newPassword) payload.newPassword = formData.newPassword;
    if (formData.confirmPassword)
      payload.confirmPassword = formData.confirmPassword;

    try {
      const res = await api.put(`/auth/organizer/${userId}`, payload);
      setMessage(res.data.message || "✅ Profile updated successfully!");

      // Update localStorage with new user data
      const updatedUserData = {
        ...currentUser,
        name: res.data.name,
        email: res.data.email,
        mobile: res.data.mobile,
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to update profile.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-10 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Update Profile
      </h2>

      {message && (
        <p
          className={`text-sm mb-4 text-center ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            <FiUser className="inline-block mr-2" />
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Full Name"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            <FiPhone className="inline-block mr-2" />
            Mobile
          </label>
          <input
            name="mobile"
            maxLength={10}
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Mobile Number"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            📧 Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Email address"
          />
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Current Password */}
        <div className="relative">
          <label className="block mb-1 font-medium text-gray-700">
            <FiLock className="inline-block mr-2" />
            Current Password
          </label>
          <input
            name="currentPassword"
            type={showPassword.current ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10"
            placeholder="Enter current password"
          />
          <span
            onClick={() => togglePasswordVisibility("current")}
            className="absolute right-3 top-[30px] cursor-pointer text-gray-500"
          >
            {showPassword.current ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block mb-1 font-medium text-gray-700">
            <FiLock className="inline-block mr-2" />
            New Password
          </label>
          <input
            name="newPassword"
            type={showPassword.new ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10"
            placeholder="Enter new password"
          />
          <span
            onClick={() => togglePasswordVisibility("new")}
            className="absolute right-3 top-[30px] cursor-pointer text-gray-500"
          >
            {showPassword.new ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block mb-1 font-medium text-gray-700">
            <FiCheck className="inline-block mr-2" />
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type={showPassword.confirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10"
            placeholder="Confirm new password"
          />
          <span
            onClick={() => togglePasswordVisibility("confirm")}
            className="absolute right-3 top-[30px] cursor-pointer text-gray-500"
          >
            {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default OrgUpdateProfile;
