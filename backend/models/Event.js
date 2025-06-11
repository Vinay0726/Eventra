
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, minlength: 6 },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },

  isPaid: { type: Boolean, default: false },
  ticketPrice: { type: Number, default: 0 },
  totalTickets: { type: Number, default: 0 },
  availableTickets: { type: Number, required: true, default: 0 },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
