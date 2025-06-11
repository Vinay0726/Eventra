import { useEffect, useState } from "react";
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaBell } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { HiMenu } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import AuthModalOrganizer from "../organizer/AuthModalOrganizer";
import AuthModal from "./AuthModel";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthOrganizerModalOpen, setIsAuthOrganizerModalOpen] =
    useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  // Auth modals
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openAuthOrganizerModal = () => setIsAuthOrganizerModalOpen(true);
  const closeAuthOrganizerModal = () => setIsAuthOrganizerModalOpen(false);

  const togglePopover = () => setIsPopoverOpen(!isPopoverOpen);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("logoutSuccess"));
    navigate("/");
  };

  // Load user on login/logout events
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("userToken");
      const username = localStorage.getItem("userName");
      if (token && username) {
        setUserName(username);
      } else {
        setUserName("");
      }
    };

    loadUser();

    window.addEventListener("loginSuccess", loadUser);
    window.addEventListener("logoutSuccess", loadUser);

    return () => {
      window.removeEventListener("loginSuccess", loadUser);
      window.removeEventListener("logoutSuccess", loadUser);
    };
  }, []);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50 px-4 sm:px-10 md:px-20">
        <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <FaCalendarAlt className="text-2xl" /> Eventra
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center text-black space-x-6 relative">
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>
            <a href="#feedback" className="hover:text-indigo-600 transition">
              Feedback
            </a>
            <button
              onClick={() => navigate("/user/events")}
              className="text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
            >
              All Events
            </button>
            {userName ? (
              <div className="relative">
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => {
                      navigate("/user/notifications");
                    }}
                    className=" h-10 w-10 flex justify-center items-center font-semibold text-lg rounded-full"
                  >
                    <FaBell className="mr-1 text-yellow-500" />
                  </button>
                  <button
                    onClick={togglePopover}
                    className="bg-indigo-600 text-white h-10 w-10 flex justify-center items-center font-semibold text-lg rounded-full"
                  >
                    {userName.charAt(0).toUpperCase()}
                  </button>
                </div>
                {isPopoverOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        navigate("/user/profile");
                        togglePopover();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaUser className="text-green-500" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/user/registered-events");
                        togglePopover();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaCalendarAlt className="text-blue-500" />
                      Registered Events
                    </button>
                    <button
                      onClick={() => {
                        navigate("/user/payment-history");
                        togglePopover();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaSignOutAlt className="text-yellow-500" />
                      Payment History
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        togglePopover();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={openAuthModal}
                  className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  User Login
                </button>
                <button
                  onClick={openAuthOrganizerModal}
                  className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  Organizer Login
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-3xl text-indigo-600"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <RxCross2 /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {navOpen && (
          <div className="md:hidden px-4 pb-4 space-y-3 text-center">
            <a
              href="#features"
              onClick={() => setNavOpen(false)}
              className="block text-gray-700 hover:text-indigo-600 transition"
            >
              Features
            </a>
            <a
              href="#feedback"
              onClick={() => setNavOpen(false)}
              className="block text-gray-700 hover:text-indigo-600 transition"
            >
              Feedback
            </a>
            {userName ? (
              <div className="space-y-2 mt-4">
                <button
                  onClick={() => {
                    navigate("/user/profile");
                    setNavOpen(false);
                  }}
                  className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/user/registered-events");
                    setNavOpen(false);
                  }}
                  className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  Registered Events
                </button>
                <button
                  onClick={() => {
                    navigate("/user/payment-history");
                    setNavOpen(false);
                  }}
                  className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  Payment History
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setNavOpen(false);
                  }}
                  className="w-full border border-red-500 text-red-600 py-2 rounded-md hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 mt-6">
                <button
                  onClick={openAuthModal}
                  className="w-60 border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  User Login
                </button>
                <button
                  onClick={openAuthOrganizerModal}
                  className="w-60 border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  Organizer Login
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Auth Modals */}
      <AuthModal open={isAuthModalOpen} handleClose={closeAuthModal} />
      <AuthModalOrganizer
        open={isAuthOrganizerModalOpen}
        handleClose={closeAuthOrganizerModal}
      />
    </>
  );
}
