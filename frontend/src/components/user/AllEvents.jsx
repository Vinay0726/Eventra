import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  MdEventNote,
  MdPerson,
  MdLocationOn,
  MdCategory,
  MdAttachMoney,
  MdEventAvailable,
  MdAirlineSeatReclineNormal,
} from "react-icons/md";
import { FaSearch, FaRegCalendarCheck } from "react-icons/fa";
import { toast } from "react-hot-toast";

const categories = [
  "Technology",
  "Education",
  "Music",
  "Sports",
  "Health",
  "Business",
];

const categoryIcons = {
  Technology: "💻",
  Education: "📚",
  Music: "🎵",
  Sports: "⚽",
  Health: "🏥",
  Business: "💼",
};

const EVENTS_PER_PAGE = 6;

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [seatSelections, setSeatSelections] = useState({}); // Track seats for each event
  
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        
        const res = await api.get("/events/public/approved");
        setEvents(res.data);
        setFiltered(res.data);
        // Initialize seat selections for each event
        const initialSeats = res.data.reduce((acc, event) => {
          acc[event._id] = 1; // Default to 1 seat
          return acc;
        }, {});
        setSeatSelections(initialSeats);
      } catch (err) {
        setError("❌ Failed to load approved events");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedEvents();
  }, []);

  useEffect(() => {
    let result = [...events];
    if (selectedCategory) {
      result = result.filter((e) => e.category === selectedCategory);
    }
    if (searchTerm) {
      result = result.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFiltered(result);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, events]);

  const totalPages = Math.ceil(filtered.length / EVENTS_PER_PAGE);
  const paginatedEvents = filtered.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  const handleSeatChange = (eventId, delta) => {
    setSeatSelections((prev) => {
      const currentSeats = prev[eventId] || 1;
      const event = events.find((e) => e._id === eventId);
      const maxSeats = Math.min(event.availableTickets, 10); // Cap at 10 or available tickets
      const newSeats = Math.max(1, Math.min(currentSeats + delta, maxSeats)); // Ensure seats are between 1 and max
      return { ...prev, [eventId]: newSeats };
    });
  };

  const handleRegister = async (event) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/"); // Redirect to login page
      return;
    }

    const seats = seatSelections[event._id] || 1;
    const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = currentUser.id;

    if (seats > event.availableTickets) {
      toast.error(`Only ${event.availableTickets} seats are available!`, {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    if (event.isPaid) {
      navigate(`/payment/${event._id}?seats=${seats}`);
    } else {
      try {
        await api.post("/payment/register", {
          eventId: event._id,
          seats,
          userId,
        });
        toast.success("Registered successfully for free event! 🎉", {
          duration: 4000,
          position: "top-right",
        });
        navigate("/user/payment-history");
      } catch (error) {
        console.error("Registration Error:", error);
        toast.error("Registration failed. Please try again.", {
          duration: 4000,
          position: "top-right",
        });
      }
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500 font-semibold">
        Loading events...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="w-full mx-auto px-60 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Upcoming Events
      </h1>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 mt-20 justify-between items-center mb-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() =>
                setSelectedCategory((prev) => (prev === cat ? "" : cat))
              }
            >
              {categoryIcons[cat]} {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border rounded px-3 py-1 bg-white">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search events..."
            className="outline-none text-sm py-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Events */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">No events found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300 border"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <MdEventNote className="text-indigo-500" />
                {event.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <p className="text-sm flex items-center gap-2 text-gray-700 mb-1">
                <MdPerson /> Organizer:{" "}
                <span className="font-medium">
                  {event.organizerId?.name || "Unknown"}
                </span>
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-700 mb-1">
                <MdCategory /> Category: {event.category}{" "}
                {categoryIcons[event.category]}
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-700 mb-1">
                <MdEventAvailable /> Date:{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-700 mb-1">
                <MdLocationOn /> Venue: {event.venue}
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-700 mb-1">
                <MdAttachMoney /> Price:{" "}
                {event.isPaid ? `₹${event.ticketPrice.toFixed(2)}` : "Free"}
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-700 mb-3">
                <MdAirlineSeatReclineNormal />
                Available Seats: {event.availableTickets}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm text-gray-700">Select Seats:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSeatChange(event._id, -1)}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition"
                    disabled={
                      (seatSelections[event._id] || 1) <= 1 ||
                      event.availableTickets === 0
                    }
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">
                    {seatSelections[event._id] || 1}
                  </span>
                  <button
                    onClick={() => handleSeatChange(event._id, 1)}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition"
                    disabled={
                      (seatSelections[event._id] || 1) >=
                        Math.min(event.availableTickets, 10) ||
                      event.availableTickets === 0
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRegister(event)}
                className="bg-indigo-600 text-white w-full py-2 rounded-md hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
                disabled={event.availableTickets === 0}
              >
                <FaRegCalendarCheck /> Register
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border font-medium ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEvents;
