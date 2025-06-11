import React, { useState } from "react";
import {
  NavLink,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaSignOutAlt,
  FaUserCircle,
  FaPlus,
  FaListUl,
  FaChevronDown,
  FaChevronUp,
  FaBell,
  FaComments,
} from "react-icons/fa";
import DashboardHome from "./DashboardHome";
import AddEvent from "./AddEvent";
import ViewEvents from "./ViewEvents";
import OrgUpdateProfile from "./OrgUpdateProfile";
import OrganizerPaymentHistory from "./OrganizerPaymentHistory";
import { MdOutlinePayment } from "react-icons/md";
import OrgReport from "./OrgReport";
import OrganizerNotifications from "./OrganizerNotifications";
import OrganizerFeedbackView from "./OrganizerFeedbackView";

const OrganizerSidebar = () => {
  const navigate = useNavigate();
  const organizerName = localStorage.getItem("userName") || "Organizer";

  const handleLogout = () => {
    localStorage.removeItem("organizerToken");
    localStorage.removeItem("organizerName");
    navigate("/organizer/login");
  };

  const [showEventSubmenu, setShowEventSubmenu] = useState(false);

  return (
    <aside className="w-64 bg-gradient-to-b from-teal-700 to-blue-800 text-white min-h-screen p-6 flex flex-col justify-between shadow-lg">
      <div>
        <h1 className="text-xl font-bold mb-1">Welcome,</h1>
        <h2 className="text-lg font-semibold mb-6">{organizerName}</h2>

        <nav className="space-y-3">
          <NavLink
            to="/organizer/dashboard/home"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-white text-gray-900 font-semibold"
                  : "hover:bg-teal-600"
              }`
            }
          >
            <FaTachometerAlt />
            Dashboard
          </NavLink>

          <button
            onClick={() => setShowEventSubmenu(!showEventSubmenu)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-md hover:bg-teal-600 transition"
          >
            <span className="flex items-center gap-3">
              <FaCalendarAlt />
              My Events
            </span>
            {showEventSubmenu ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {showEventSubmenu && (
            <div className="ml-6 mt-2 space-y-2">
              <NavLink
                to="/organizer/dashboard/events/add"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1 rounded-md text-sm transition ${
                    isActive
                      ? "bg-white text-gray-900 font-semibold"
                      : "hover:bg-teal-600"
                  }`
                }
              >
                <FaPlus />
                Add Event
              </NavLink>
              <NavLink
                to="/organizer/dashboard/events/view"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1 rounded-md text-sm transition ${
                    isActive
                      ? "bg-white text-gray-900 font-semibold"
                      : "hover:bg-teal-600"
                  }`
                }
              >
                <FaListUl />
                View Events
              </NavLink>
            </div>
          )}
          <NavLink
            to="/organizer/dashboard/payments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-white text-gray-900 font-semibold"
                  : "hover:bg-teal-600"
              }`
            }
          >
            <MdOutlinePayment />
            Payment History
          </NavLink>
          <NavLink
            to="/organizer/dashboard/notifications"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-white text-gray-900 font-semibold"
                  : "hover:bg-teal-600"
              }`
            }
          >
            <FaBell />
            Notifications
          </NavLink>
          {/* Added Feedback Button */}
          <NavLink
            to="/organizer/dashboard/feedback"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-white text-gray-900 font-semibold"
                  : "hover:bg-teal-600"
              }`
            }
          >
            <FaComments />
            Feedback
          </NavLink>
          <NavLink
            to="/organizer/dashboard/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-white text-gray-900 font-semibold"
                  : "hover:bg-teal-600"
              }`
            }
          >
            <FaChartLine />
            Reports
          </NavLink>
          <NavLink
            to="/organizer/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-white text-gray-900 font-semibold"
                  : "hover:bg-teal-600"
              }`
            }
          >
            <FaUserCircle />
            Profile
          </NavLink>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 mt-6 rounded-md hover:bg-red-600 bg-red-500 transition"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
};

const OrganizerDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <OrganizerSidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="dashboard/home" element={<DashboardHome />} />
          <Route path="dashboard/events/add" element={<AddEvent />} />
          <Route path="dashboard/events/view" element={<ViewEvents />} />
          <Route
            path="dashboard/payments"
            element={<OrganizerPaymentHistory />}
          />
          <Route path="dashboard/reports" element={<OrgReport />} />
          <Route path="dashboard/profile" element={<OrgUpdateProfile />} />
          <Route
            path="dashboard/notifications"
            element={<OrganizerNotifications />}
          />
          <Route
            path="dashboard/feedback"
            element={<OrganizerFeedbackView />}
          />
          <Route index element={<Navigate to="dashboard/home" />} />
        </Routes>
      </main>
    </div>
  );
};

export default OrganizerDashboard;
