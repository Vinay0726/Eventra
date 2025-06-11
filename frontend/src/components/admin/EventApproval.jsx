import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const EventApproval = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get("/events/admin/pending");
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
      setError("Failed to load pending events.");
    }
  };

  const handleApprove = async (eventId) => {
    if (!window.confirm("Are you sure you want to approve this event?")) return;
    try {
      const res = await api.put(`/events/admin/approve/${eventId}`);
      setMessage(res.data.message || "Event approved successfully!");
      setError("");
      fetchPendingEvents();
    } catch (error) {
      console.error("Failed to approve event", error);
      setMessage("");
      setError("❌ Failed to approve event");
    }
  };

  const handleReject = async (eventId) => {
    if (!window.confirm("Are you sure you want to reject this event?")) return;
    try {
      const res = await api.put(`/events/admin/reject/${eventId}`);
      setMessage(res.data.message || "Event rejected.");
      setError("");
      fetchPendingEvents();
    } catch (error) {
      console.error("Failed to reject event", error);
      setMessage("");
      setError("❌ Failed to reject event");
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  return (
    <div className=" w-full mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Pending Event Approvals
      </h2>

      {message && (
        <p className="mb-4 p-3 bg-green-100 text-green-700 rounded font-medium">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 p-3 bg-red-100 text-red-700 rounded font-medium">
          {error}
        </p>
      )}

      {events.length === 0 ? (
        <p className="text-gray-600 text-center py-10 text-lg">
          No pending events.
        </p>
      ) : (
        <div className="space-x-6 flex">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg p-6 rounded-lg border border-gray-200"
            >
              <h3 className="text-xl flex justify-between font-bold text-gray-900 mb-1">
                {event.name}{" "}
                {event.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                    {event.category}
                  </span>
                )}
              </h3>

              <p className="text-sm text-indigo-600 font-semibold mb-3">
                Organizer: {event.organizerId?.name || "Unknown Organizer"}
              </p>
              <p className="text-gray-700 mb-2 line-clamp-3">
                {event.description}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-500 mb-3">
                <strong>Time:</strong> {event.time}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Venue:</strong> {event.venue}
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(event._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-200"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(event._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition duration-200"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventApproval;
