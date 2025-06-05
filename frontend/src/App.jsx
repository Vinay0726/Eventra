import { Routes, Route } from "react-router-dom";
import Navbar from "./components/user/Navbar";
import Hero from "./components/user/Hero";
import Features from "./components/user/Features";
import Contact from "./components/user/Contact";
import Footer from "./components/user/Footer";
import AdminLogin from "./components/admin/AdminLogin";
import UserRegister from "./components/user/UserRegister";
import OrganizerLogin from "./components/organizer/OrganizerLogin";
import UserLogin from "./components/user/UserLogin";
import OrganizerRegister from "./components/organizer/OrganizerRegister";

const App = () => {
  return (
    <div className="font-sans">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Features />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* User Auth */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />

        {/* Organizer Auth */}
        <Route path="/organizer/login" element={<OrganizerLogin />} />
        <Route path="/organizer/register" element={<OrganizerRegister />} />

        {/* admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </div>
  );
};

export default App;
