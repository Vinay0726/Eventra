import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/login", { email, password });
      const { user, token } = res.data;

      localStorage.setItem("eventra_user", JSON.stringify({ ...user, token }));

      if (user.role === "organizer") navigate("/organizer/dashboard");
      else if (user.role === "user") navigate("/user/dashboard");
      else setError("Unknown role");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-2 p-6 ">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
        Login to Eventra
      </h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
            <FiMail className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
            <FiLock className="text-gray-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        Don’t have an account?{" "}
        <span
          className="text-green-600 cursor-pointer hover:underline"
          onClick={() => navigate("/user/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
};

export default UserLogin;
