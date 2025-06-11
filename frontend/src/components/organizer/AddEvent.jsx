import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaPaperPlane,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import api from "../../api/axios";

const AddEvent = () => {
  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const organizerId = currentUser.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    ticketType: "free",
    ticketPrice: 0,
    totalTickets: 0,
  });

  const categories = [
    "Technology",
    "Education",
    "Music",
    "Sports",
    "Health",
    "Business",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ticketType" && value === "free") {
      // Set ticketPrice to 0 when event is free
      setFormData({ ...formData, [name]: value, ticketPrice: 0 });
    } else if (name === "ticketPrice" || name === "totalTickets") {
      // Allow empty input or convert to number
      const parsedValue = value === "" ? "" : Number(value);
      setFormData({ ...formData, [name]: parsedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate totalTickets for paid events
    if (
      formData.ticketType === "paid" &&
      (formData.ticketPrice <= 0 || formData.totalTickets <= 0)
    ) {
      toast.error(
        "Please enter a valid ticket price and total tickets greater than 0.",
        { position: "top-right", duration: 4000 }
      );
      return;
    }

    // For free events, totalTickets must be > 0 as well
    if (formData.ticketType === "free" && formData.totalTickets <= 0) {
      toast.error("Please enter total tickets greater than 0.", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }

    try {
      await api.post("/events", {
        ...formData,
        organizerId,
        ticketPrice:
          formData.ticketType === "free" ? 0 : Number(formData.ticketPrice),
        totalTickets: Number(formData.totalTickets),
        availableTickets: Number(formData.totalTickets),
        isPaid: formData.ticketType === "paid",
      });

      toast.success("Event submitted for admin approval.", {
        position: "top-right",
        duration: 4000,
      });

      setFormData({
        name: "",
        description: "",
        category: "",
        date: "",
        time: "",
        venue: "",
        ticketType: "free",
        ticketPrice: 0,
        totalTickets: 0,
      });
    } catch (err) {
      toast.error("Error adding event", {
        position: "top-right",
        duration: 4000,
      });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <Toaster />
      <div className="max-w-3xl w-full mx-4 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-2">
          <FaCalendarAlt className="text-blue-600" />
          Add New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaTag className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="relative">
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[120px]"
            />
          </div>

          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="relative w-1/2">
              <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="relative w-1/2">
              <FaClock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="relative">
            <FaMapMarkerAlt className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="venue"
              placeholder="Venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="ticketType"
                value="free"
                checked={formData.ticketType === "free"}
                onChange={handleChange}
                className="h-5 w-5 bg-amber-50 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Free</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="ticketType"
                value="paid"
                checked={formData.ticketType === "paid"}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Paid</span>
            </label>

            {formData.ticketType === "paid" && (
              <div className="relative w-1/3">
                <FaIndianRupeeSign className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="number"
                  name="ticketPrice"
                  placeholder="Ticket Price"
                  value={formData.ticketPrice === 0 ? "" : formData.ticketPrice}
                  onChange={handleChange}
                  min={1}
                  required={formData.ticketType === "paid"}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="number"
              name="totalTickets"
              placeholder="Total Tickets"
              value={formData.totalTickets === 0 ? "" : formData.totalTickets}
              onChange={handleChange}
              min={1}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <FaPaperPlane />
            Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
