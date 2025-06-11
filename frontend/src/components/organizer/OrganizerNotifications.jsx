import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  FaBell,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrganizerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState(
    "You haven’t sent any notifications yet."
  );
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
      const organizerId = currentUser.id;

      if (!organizerId || !/^[0-9a-fA-F]{24}$/.test(organizerId)) {
        toast.error("Please log in as an organizer to view notifications");
        navigate("/login");
        return;
      }

      if (currentUser.role !== "organizer") {
        toast.error("Access denied: You must be an organizer");
        navigate("/events");
        return;
      }

      const res = await api.get(
        `/events/organizer/notifications/${organizerId}`
      );
      setNotifications(res.data.notifications || []);
      setEmptyMessage(
        res.data.message || "You haven’t sent any notifications yet."
      );
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error(err.response?.data?.error || "Failed to fetch notifications");
      if (err.response?.status === 400 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [navigate]);

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setNewMessage(notification.message);
  };

  const handleUpdate = async () => {
    if (!newMessage.trim()) {
      toast.error("Notification message cannot be empty");
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.put(
        `/events/notifications/${editingNotification._id}`,
        { message: newMessage }
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === editingNotification._id ? res.data.notification : notif
        )
      );
      setEditingNotification(null);
      setNewMessage("");
      toast.success("Notification updated successfully");
    } catch (err) {
      console.error("Error updating notification:", err);
      toast.error(err.response?.data?.error || "Failed to update notification");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;

    setActionLoading(true);
    try {
      await api.delete(`/events/notifications/${notificationId}`);

      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
      toast.success("Notification deleted successfully");
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error(err.response?.data?.error || "Failed to delete notification");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (date, time) => {
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) return "N/A";
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime =
      time ||
      eventDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <FaBell className="text-indigo-600 mr-3" />
            Your Sent Notifications
          </h2>
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <FaSyncAlt className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Notification List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="relative p-6 rounded-xl shadow-sm border-l-4 bg-white border-indigo-600"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {notification.eventId?.name || "Unknown Event"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Date & Time:</span>{" "}
                      {notification.eventId?.date
                        ? formatDateTime(
                            notification.eventId.date,
                            notification.eventId.time
                          )
                        : "N/A"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Venue:</span>{" "}
                      {notification.eventId?.venue || "N/A"}
                    </p>
                    <p className="mt-2 text-base text-gray-800">
                      <span className="font-medium">Message:</span>{" "}
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Sent on:{" "}
                      {new Date(notification.sentAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <button
                      onClick={() => handleEdit(notification)}
                      disabled={actionLoading}
                      className="text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 text-sm rounded-lg"
                    >
                      <FaEdit className="mr-1 inline" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(notification._id)}
                      disabled={actionLoading}
                      className="text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1.5 text-sm rounded-lg"
                    >
                      {actionLoading ? (
                        <FaSyncAlt className="mr-1 animate-spin inline" />
                      ) : (
                        <FaTrash className="mr-1 inline" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Notification
                </h3>
                <button
                  onClick={() => setEditingNotification(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows="3"
                  placeholder="Enter your notification message..."
                  disabled={actionLoading}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingNotification(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={actionLoading}
                  className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-indigo-700"
                >
                  {actionLoading ? (
                    <FaSyncAlt className="inline mr-2 animate-spin" />
                  ) : (
                    <FaSave className="inline mr-2" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerNotifications;
