import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaTrash, FaEdit, FaUsers, FaBell, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import ViewRegisteredUsersModal from "./ViewRegisteredUsersModal";

const ViewEvents = () => {
  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  console.log("currentuserdata", currentUser);
  const organizerId = currentUser.id;
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    isPaid: false,
    ticketPrice: 0,
    totalTickets: 0,
  });
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState("");
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationEventId, setNotificationEventId] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await api.get(`/events/organizer/${organizerId}`);
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to fetch events", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  const fetchRegisteredUsers = async (eventId, eventName) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await api.get(`/events/${eventId}/registered-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegisteredUsers(res.data.users);
      setSelectedEventName(eventName);
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Failed to fetch registered users", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted", {
        duration: 4000,
        position: "top-right",
      });
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      toast.error("Deletion failed", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toISOString().split("T")[0];
    const formattedTime =
      event.time || eventDate.toISOString().split("T")[1].slice(0, 5);
    setFormData({
      name: event.name,
      description: event.description,
      category: event.category,
      date: formattedDate,
      time: formattedTime,
      venue: event.venue,
      isPaid: event.isPaid,
      ticketPrice: event.ticketPrice,
      totalTickets: event.totalTickets,
    });
  };

  const handleUpdate = async () => {
    try {
      const combinedDateTime = `${formData.date}T${formData.time}:00.000Z`;
      const updatedData = {
        ...formData,
        date: combinedDateTime,
      };
      await api.put(`/events/${editingEvent._id}`, updatedData);
      toast.success("Event updated", {
        duration: 4000,
        position: "top-right",
      });
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      toast.error("Update failed", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRegisteredUsers([]);
    setSelectedEventName("");
  };

  const openNotificationModal = (eventId) => {
    setNotificationEventId(eventId);
    setNotificationMessage("");
    setIsNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
    setNotificationEventId(null);
    setNotificationMessage("");
  };

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      toast.error("Notification message cannot be empty", {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    setIsSendingNotification(true);
    try {
      const token = localStorage.getItem("userToken");
      const response = await api.post(
        `/events/${notificationEventId}/send-notification`,
        { message: notificationMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Notification sent to users`, {
        duration: 4000,
        position: "top-right",
      });
      closeNotificationModal();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send notification", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  return (
    <div className="py-10 px-16">
      <h2 className="text-2xl font-bold mb-4">Your Events</h2>

      {editingEvent && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="font-semibold text-lg mb-2">Edit Event</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-2 rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              className="border p-2 rounded"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              type="time"
              className="border p-2 rounded"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Venue"
              className="border p-2 rounded"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPaid"
                checked={formData.isPaid}
                onChange={(e) =>
                  setFormData({ ...formData, isPaid: e.target.checked })
                }
              />
              <label htmlFor="isPaid" className="text-sm text-gray-700">
                Is Paid Event
              </label>
            </div>
            <input
              type="number"
              placeholder="Ticket Price"
              className="border p-2 rounded"
              value={formData.ticketPrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ticketPrice: parseFloat(e.target.value) || 0,
                })
              }
              disabled={!formData.isPaid}
            />
            <input
              type="number"
              placeholder="Total Tickets"
              className="border p-2 rounded"
              value={formData.totalTickets}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalTickets: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="mt-3">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700 transition"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              onClick={() => setEditingEvent(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Date</th>
            <th className="p-3">Time</th>
            <th className="p-3">Venue</th>
            <th className="p-3">Is Paid</th>
            <th className="p-3">Ticket Price</th>
            <th className="p-3">Total Tickets</th>
            <th className="p-3">Available Tickets</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center p-4">
                No events found
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event._id} className="border-t">
                <td className="p-3">{event.name}</td>
                <td className="p-3">{event.category}</td>
                <td className="p-3">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="p-3">
                  {event.time ||
                    new Date(event.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </td>
                <td className="p-3">{event.venue}</td>
                <td className="p-3">{event.isPaid ? "Yes" : "No"}</td>
                <td className="p-3">
                  {event.isPaid ? `₹${event.ticketPrice.toFixed(2)}` : "Free"}
                </td>
                <td className="p-3">{event.totalTickets}</td>
                <td className="p-3">{event.availableTickets}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => fetchRegisteredUsers(event._id, event.name)}
                  >
                    <FaUsers />
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                    onClick={() => startEdit(event)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(event._id)}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                    onClick={() => openNotificationModal(event._id)}
                  >
                    <FaBell />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ViewRegisteredUsersModal
        users={registeredUsers}
        eventName={selectedEventName}
        totalTickets={
          events.find((event) => event.name === selectedEventName)?.totalTickets
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Notification Modal */}
      {isNotificationModalOpen && (
        <div
          className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeNotificationModal}
        >
          <div
            className="bg-white border border-gray-300 shadow-2xl rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Send Notification
              </h3>
              <button
                onClick={closeNotificationModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="mb-4">
              <textarea
                className="w-full border p-2 rounded h-32 resize-none"
                placeholder="Enter your notification message..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleSendNotification}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:bg-green-300"
                disabled={isSendingNotification}
              >
                {isSendingNotification ? "Sending..." : "Send Notification"}
              </button>
              <button
                onClick={closeNotificationModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEvents;
