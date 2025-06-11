import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  MdEventNote,
  MdPerson,
  MdLocationOn,
  MdCategory,
  MdAttachMoney,
  MdEventAvailable,
  MdCheckCircle,
  MdCancel,
  MdPendingActions,
} from "react-icons/md";

const statusIcon = (status) => {
  switch (status) {
    case "approved":
      return (
        <div className="flex items-center justify-center space-x-1 text-green-600 font-semibold">
          <MdCheckCircle />
          <span>Approved</span>
        </div>
      );
    case "rejected":
      return (
        <div className="flex items-center justify-center space-x-1 text-red-600 font-semibold">
          <MdCancel />
          <span>Rejected</span>
        </div>
      );
    case "pending":
    default:
      return (
        <div className="flex items-center justify-center space-x-1 text-yellow-600 font-semibold">
          <MdPendingActions />
          <span>Pending</span>
        </div>
      );
  }
};
  

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  if (events.length === 0)
    return (
      <div className="text-center py-10 text-gray-600 font-medium">
        No events found.
      </div>
    );

  return (
    <div className=" w-full mx-auto p-2">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Events</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left font-medium text-gray-600">
                <MdEventNote className="inline mr-1 mb-1" />
                Event Name
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">
                Description
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">
                <MdPerson className="inline mr-1 mb-1" />
                Organizer
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">
                <MdCategory className="inline mr-1 mb-1" />
                Category
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">
                <MdEventAvailable className="inline mr-1 mb-1" />
                Date
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">
                <MdLocationOn className="inline mr-1 mb-1" />
                Venue
              </th>
              <th className="py-3 px-6 text-center font-medium text-gray-600">
                Tickets Available
              </th>
              <th className="py-3 px-6 text-center font-medium text-gray-600">
                <MdAttachMoney className="inline mr-1 mb-1" />
                Price
              </th>
              <th className="py-3 px-6 text-center font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr
                key={event._id}
                className={
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"
                }
              >
                <td className="py-3 px-6 whitespace-nowrap text-gray-800 font-semibold">
                  {event.name}
                </td>
                <td
                  className="py-3 px-6 max-w-xs truncate"
                  title={event.description}
                >
                  {event.description}
                </td>
                <td className="py-3 px-6 whitespace-nowrap text-gray-700">
                  {event.organizerId?.name || "Unknown"}
                </td>
                <td className="py-3 px-6 whitespace-nowrap text-gray-700">
                  {event.category}
                </td>
                <td className="py-3 px-6 whitespace-nowrap text-gray-700">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 whitespace-nowrap text-gray-700">
                  {event.venue}
                </td>
                <td className="py-3 px-6 whitespace-nowrap text-center text-gray-700 font-semibold">
                  {event.availableTickets}
                </td>
                <td className="py-3 px-6 whitespace-nowrap text-center text-gray-700 font-semibold">
                  {event.isPaid ? `₹ ${event.ticketPrice.toFixed(2)}` : "Free"}
                </td>
                <td className="py-3 px-6 whitespace-nowrap text-center">
                  {statusIcon(event.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEvents;
