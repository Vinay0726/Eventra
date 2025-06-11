import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { FaBell, FaCheck, FaSyncAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readNotifications, setReadNotifications] = useState(() => {
    const saved = localStorage.getItem("readNotifications");
    return saved ? JSON.parse(saved) : {};
  });
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = currentUser.id;

      if (!userId) {
        toast.error("Please log in to view notifications", {
          duration: 4000,
          position: "top-right",
        });
        navigate("/login");
        return;
      }

      const res = await api.get(`/events/user/notifications?userId=${userId}`);
      setNotifications(res.data.notifications);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to fetch notifications",
        {
          duration: 4000,
          position: "top-right",
        }
      );
      if (err.response?.status === 400) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem(
      "readNotifications",
      JSON.stringify(readNotifications)
    );
  }, [readNotifications]);

  const markAsRead = (notificationId) => {
    setReadNotifications((prev) => ({
      ...prev,
      [notificationId]: true,
    }));
    toast.success("Notification marked as read", {
      duration: 4000,
      position: "top-right",
    });
  };

  const markAllAsRead = () => {
    const updatedReadNotifications = { ...readNotifications };
    notifications.forEach((notification) => {
      updatedReadNotifications[notification._id] = true;
    });
    setReadNotifications(updatedReadNotifications);
    toast.success("All notifications marked as read", {
      duration: 4000,
      position: "top-right",
    });
  };

  const formatDateTime = (date, time) => {
    const eventDate = new Date(date);
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

  const unreadCount = notifications.filter(
    (notification) => !readNotifications[notification._id]
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
              <FaBell className="text-indigo-600 mr-3" aria-hidden="true" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Mark all notifications as read"
              >
                <FaCheck className="mr-2" /> Mark All as Read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
              aria-label="Refresh notifications"
            >
              <FaSyncAlt
                className={`mr-2 ${loading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell
              className="mx-auto h-12 w-12 text-gray-400"
              aria-hidden="true"
            />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You don’t have any notifications yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const isRead = !!readNotifications[notification._id];
              return (
                <div
                  key={notification._id}
                  className={`relative p-6 rounded-xl shadow-sm border-l-4 ${
                    isRead
                      ? "bg-white border-gray-200"
                      : "bg-indigo-50 border-indigo-600"
                  } transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500`}
                  tabIndex={0}
                  role="article"
                  aria-labelledby={`notification-title-${notification._id}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3
                        id={`notification-title-${notification._id}`}
                        className="text-lg font-semibold text-gray-900"
                      >
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
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          isRead
                            ? "bg-gray-200 text-gray-700"
                            : "bg-indigo-600 text-white"
                        }`}
                      >
                        {isRead ? "Read" : "Unread"}
                      </span>
                      {!isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          aria-label={`Mark notification for ${notification.eventId?.name} as read`}
                        >
                          <FaCheck className="mr-1" aria-hidden="true" />
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotifications;
