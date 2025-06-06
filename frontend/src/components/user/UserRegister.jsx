import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // centralized axios instance

const UserRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register/user", form);

      setError("");
      setSuccess("Registration successful! Redirecting to login...");

      setForm({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "user",
      });

      setTimeout(() => {
        navigate("/user/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
      setSuccess("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-2 p-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        User Register
      </h2>

      <form onSubmit={handleRegister} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm mb-1 text-gray-700">Full Name</label>
          <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
            <FiUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full outline-none bg-transparent"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
            <FiMail className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full outline-none bg-transparent"
              required
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm mb-1 text-gray-700">Phone</label>
          <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
            <FiPhone className="text-gray-500 mr-2" />
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="+91 1234567890"
              className="w-full outline-none bg-transparent"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
            <FiLock className="text-gray-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full outline-none bg-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-500" />
              ) : (
                <FiEye className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Success or Error messages */}
        {success && (
          <p className="text-blue-600 text-center text-sm">{success}</p>
        )}
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => navigate("/user/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default UserRegister;
