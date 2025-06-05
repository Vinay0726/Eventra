import { FaCalendarAlt, FaTicketAlt, FaUsers } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white py-24 px-4 sm:px-10 md:px-20">
      {/* Glass-like overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-md">
          Welcome to <span className="text-yellow-300">Eventra</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
          Your one-stop solution for organizing, managing, and attending events
          effortlessly.
        </p>

        <a
          href="#features"
          className="inline-block px-8 py-3 rounded-full bg-white text-indigo-700 font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          🎉 Explore Features
        </a>

        {/* Icon Row */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
          <div className="flex items-center gap-2 text-lg">
            <FaCalendarAlt className="text-2xl" />
            <span>Create Events</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <FaTicketAlt className="text-2xl" />
            <span>Manage Tickets</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <FaUsers className="text-2xl" />
            <span>Track Attendees</span>
          </div>
        </div>
      </div>
    </section>
  );
}
