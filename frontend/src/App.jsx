import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/user/Navbar";

import Footer from "./components/user/Footer";
import AdminLogin from "./components/admin/AdminLogin";

import HomePage from "./components/user/HomePage";
import AdminDashboard from "./components/admin/AdminDashboard";
import OrganizerDashboard from "./components/organizer/OrganizerDashboard";

const App = () => {
  const location = useLocation();

  // Check if current path is under /admin
  const isAdminPath = location.pathname.startsWith("/admin");
  return (
    <div className="font-sans">
      {!isAdminPath && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* User Auth */}
        <Route path="/user/login" element={<HomePage />} />
        <Route path="/user/register" element={<HomePage />} />

        {/* Organizer Auth */}
        <Route path="/organizer/login" element={<HomePage />} />
        <Route path="/organizer/register" element={<HomePage />} />
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />

        {/* admin */}
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      {!isAdminPath && <Footer />}
    </div>
  );
};

export default App;
