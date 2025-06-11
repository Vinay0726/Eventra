// src/components/admin/DashboardHome.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // Make sure this is your axios instance

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    totalUsers: 0,
    transactionsToday: 0,
  });


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get("/dashboard/admin-dashboard");
        setStats({
          totalEvents: res.data.totalEvents,
          pendingApprovals: res.data.pendingApprovals,
          totalUsers: res.data.totalUsers,
          transactionsToday: res.data.transactionsToday,
        });
        
      } catch (error) {
        console.error("Admin dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <p className="text-center">Loading dashboard...</p>;

  const statCards = [
    { label: "Total Events", value: stats.totalEvents },
    { label: "Pending Approvals", value: stats.pendingApprovals },
    { label: "Total Users", value: stats.totalUsers },
    {
      label: "Transactions Today",
      value: `₹ ${stats.transactionsToday.toLocaleString()}`,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome, Admin</h2>
      <p className="mb-6 text-gray-600">
        Here’s an overview of today’s activity:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md p-5 rounded-lg border border-gray-100"
          >
            <h3 className="text-gray-500 font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default DashboardHome;
