import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/user/Navbar";
import Footer from "./components/user/Footer";
import AdminLogin from "./components/admin/AdminLogin";
import HomePage from "./components/user/HomePage";
import AdminDashboard from "./components/admin/AdminDashboard";
import OrganizerDashboard from "./components/organizer/OrganizerDashboard";
import UpdateProfile from "./components/user/UpdateProfile";
import AllEvents from "./components/user/AllEvents";
import Payment from "./components/user/Payment";
import Success from "./components/user/Success";
import RegisteredEvents from "./components/user/RegisteredEvents";
import PaymentHistory from "./components/user/PaymentHistory";
import UserNotifications from "./components/user/UserNotifications";

const App = () => {
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith("/admin");
  const isOrganizerPath = location.pathname.startsWith("/organizer/dashboard");

  return (
    <div className="font-sans">
      {/* ✅ Show Navbar only for user pages */}
      {!isAdminPath && !isOrganizerPath && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/profile" element={<UpdateProfile />} />
        <Route path="/user/events" element={<AllEvents />} />
        <Route path="/payment/:eventId" element={<Payment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/user/registered-events" element={<RegisteredEvents />} />
        <Route path="/user/payment-history" element={<PaymentHistory />} />
        <Route path="/user/notifications" element={<UserNotifications />} />
        {/* User Auth */}
        <Route path="/user/login" element={<HomePage />} />
        <Route path="/user/register" element={<HomePage />} />

        {/* Organizer Auth */}
        <Route path="/organizer/login" element={<HomePage />} />
        <Route path="/organizer/register" element={<HomePage />} />
        <Route path="/organizer/*" element={<OrganizerDashboard />} />

        {/* Admin */}
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>

      {/* ✅ Show Footer only for user pages */}
      {!isAdminPath && !isOrganizerPath && <Footer />}
    </div>
  );
};

export default App;
