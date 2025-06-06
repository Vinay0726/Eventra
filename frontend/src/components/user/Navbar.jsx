import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { HiMenu } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import AuthModalOrganizer from "../organizer/AuthModalOrganizer";
import AuthModal from "./AuthModel";


export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthOrganizerModalOpen, setIsAuthOrganizerModalOpen] =
    useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Auth Modals
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openAuthOrganizerModal = () => setIsAuthOrganizerModalOpen(true);
  const closeAuthOrganizerModal = () => setIsAuthOrganizerModalOpen(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50 px-4 sm:px-10 md:px-20">
        <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <FaCalendarAlt className="text-2xl" /> Eventra
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center text-black space-x-6">
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>
            <a href="#contact" className="hover:text-indigo-600 transition">
              Contact
            </a>
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
              href="#contact"
              onClick={() => setNavOpen(false)}
              className="block text-gray-700 hover:text-indigo-600 transition"
            >
              Contact
            </a>
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
