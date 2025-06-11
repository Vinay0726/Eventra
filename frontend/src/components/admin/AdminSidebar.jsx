import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaUsers,
  FaUserTie,
  FaWallet,
} from "react-icons/fa";
import { useState } from "react";


export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminLogin");
  };

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-6">Eventra Admin</h1>
        <nav className="space-y-2">
          <Link
            to="/admin/home"
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
              location.pathname === "/admin/home"
                ? "bg-white text-gray-800 font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            <FaHome /> Dashboard
          </Link>

          <button
            onClick={() => setShowSubMenu(!showSubMenu)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <span className="flex items-center gap-3">
              <FaCalendarAlt /> Events
            </span>
            <FaChevronDown
              className={`transition-transform ${
                showSubMenu ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {showSubMenu && (
            <div className="ml-6 space-y-1">
              <Link
                to="/admin/events/approved"
                className={`block px-3 py-1 rounded-md ${
                  location.pathname === "/admin/events/approved"
                    ? "bg-white text-gray-800 font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                Approved Events
              </Link>
              <Link
                to="/admin/events/all"
                className={`block px-3 py-1 rounded-md ${
                  location.pathname === "/admin/events/all"
                    ? "bg-white text-gray-800 font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                All Events
              </Link>
            </div>
          )}
          <Link
            to="/admin/payments"
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
              location.pathname === "/admin/payments"
                ? "bg-white text-gray-800 font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            <FaWallet /> Payment History
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
              location.pathname === "/admin/users"
                ? "bg-white text-gray-800 font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            <FaUsers /> Users
          </Link>

          <Link
            to="/admin/organizers"
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
              location.pathname === "/admin/organizers"
                ? "bg-white text-gray-800 font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            <FaUserTie /> Organizers
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 mt-6 rounded-md hover:bg-red-600 bg-red-500 transition"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}
