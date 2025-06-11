// src/components/organizer/DashboardHome.jsx
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaChartBar,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../api/axios"; // ✅ your configured axios instance

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const organizerId = currentUser.id;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/dashboard/org/${organizerId}`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (organizerId) fetchStats();
  }, [organizerId]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Events",
            value: stats?.totalEvents || 0,
            icon: <FaCalendarAlt className="text-blue-500 text-3xl" />,
            bg: "bg-blue-100",
          },
          {
            title: "Registered Users",
            value: stats?.registeredUsers || 0,
            icon: <FaUsers className="text-teal-500 text-3xl" />,
            bg: "bg-teal-100",
          },
          {
            title: "Approved Events",
            value: stats?.approvedEvents || 0,
            icon: <FaCheckCircle className="text-green-500 text-3xl" />,
            bg: "bg-green-100",
          },
          {
            title: "Reports",
            value: stats?.reports || 0,
            icon: <FaChartBar className="text-yellow-500 text-3xl" />,
            bg: "bg-yellow-100",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className={`rounded-xl p-4 shadow-md flex items-center ${stat.bg}`}
          >
            <div className="mr-4">{stat.icon}</div>
            <div>
              <h3 className="text-sm text-gray-700">{stat.title}</h3>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
