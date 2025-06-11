import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = currentUser.id;

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const res = await api.get(`/payment/registered/${userId}`);
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [userId]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading)
    return (
      <p className="text-center text-lg">⏳ Loading registered events...</p>
    );

  if (events.length === 0)
    return <p className="text-center text-lg">No registered events found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">
        🎟️ Registered Events
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {currentEvents.map((event) => (
          <div
            key={event._id}
            className="bg-white border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5"
          >
            <h3 className="text-xl font-semibold text-indigo-600">
              {event.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{event.category}</p>
            <p>
              <span className="font-medium">📅 Date:</span>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">🕒 Time:</span> {event.time}
            </p>
            <p>
              <span className="font-medium">📍 Venue:</span> {event.venue}
            </p>
            <p>
              <span className="font-medium">💡 Type:</span>{" "}
              {event.isPaid ? "Paid" : "Free"}
            </p>
            {event.isPaid && (
              <p>
                <span className="font-medium">💰 Ticket Price:</span> ₹
                {event.ticketPrice}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full disabled:opacity-50"
        >
          <FaChevronLeft size={16} />
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full disabled:opacity-50"
        >
          <FaChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RegisteredEvents;
