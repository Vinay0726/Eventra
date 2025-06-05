import { FaCalendarPlus, FaTicketAlt, FaBullhorn } from "react-icons/fa";

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-800">
        Key Features of Eventra
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 max-w-6xl mx-auto">
        {/* Feature 1 */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
          <FaCalendarPlus className="text-indigo-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Create & Manage Events</h3>
          <p className="text-gray-600">
            Easily create events with details like name, venue, time, and
            pricing.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
          <FaTicketAlt className="text-green-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Ticketing & Registration
          </h3>
          <p className="text-gray-600">
            Manage ticket availability, track registrations, and accept
            payments.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
          <FaBullhorn className="text-pink-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Announcements & Reports
          </h3>
          <p className="text-gray-600">
            Send event updates, view payment reports, and download attendee
            lists.
          </p>
        </div>
      </div>
    </section>
  );
}
