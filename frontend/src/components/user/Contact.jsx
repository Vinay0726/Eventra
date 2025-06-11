import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true); // For fetching events
  const [fetchError, setFetchError] = useState(false); // For fetch errors
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");

    if (!currentUser.id) {
      toast.error("Please log in to submit feedback", {
        duration: 4000,
        position: "top-right",
      });
      navigate("/login");
      return;
    }

    setUserId(currentUser.id || "");
    setName(currentUser.name || "");
    setEmail(currentUser.email || "");

    const fetchRegisteredEvents = async () => {
      setFetchLoading(true);
      try {
        const res = await api.get(`/payment/registered/${currentUser.id}`);
        if (res.data.success) {
          // Filter events to only include those that occurred before today (June 08, 2025)
          const currentDate = new Date("2025-06-08T23:59:59+05:30"); // End of June 08, 2025 IST
          const pastEvents = (res.data.events || []).filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate < currentDate;
          });
          setEvents(pastEvents);
        } else {
          toast.error("Failed to load registered events", {
            duration: 4000,
            position: "top-right",
          });
          setFetchError(true);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error(
          err.response?.data?.error || "Failed to load registered events",
          {
            duration: 4000,
            position: "top-right",
          }
        );
        setFetchError(true);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId || !message || message.trim() === "") {
      toast.error("Please select an event and enter a message", {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/feedback/submit", {
        userId,
        name,
        email,
        eventId,
        message,
      });
      toast.success("Feedback submitted successfully", {
        duration: 4000,
        position: "top-right",
      });
      setEventId("");
      setMessage("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast.error(err.response?.data?.error || "Failed to submit feedback", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="feedback"
      className="bg-gradient-to-tr from-purple-100 via-white to-green-50 py-20 px-4"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Submit Feedback
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          Share your thoughts about the events you attended. We value your
          feedback!
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-xl text-left"
        >
          {/* Name */}
          <div className="relative">
            <FiUser className="absolute left-4 top-3.5 text-gray-400 text-xl" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50"
              disabled
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-4 top-3.5 text-gray-400 text-xl" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50"
              disabled
            />
          </div>

          {/* Events Dropdown */}
          <div className="relative">
            {fetchLoading ? (
              <p className="text-gray-500 text-sm">Loading events...</p>
            ) : fetchError ? (
              <p className="text-red-500 text-sm">
                Unable to load events. Please try again later or contact
                support.
              </p>
            ) : events.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No past events found to provide feedback for.
              </p>
            ) : (
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="">Select an Event</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.name} –{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Message */}
          <div className="relative">
            <FiMessageCircle className="absolute left-4 top-3.5 text-gray-400 text-xl" />
            <textarea
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Feedback"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              disabled={fetchLoading || fetchError || events.length === 0}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading || fetchLoading || fetchError || events.length === 0
            }
            className={`w-full py-3 rounded-lg font-medium transition duration-300 ${
              loading || fetchLoading || fetchError || events.length === 0
                ? "bg-indigo-400 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "📩 Submit Feedback"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
