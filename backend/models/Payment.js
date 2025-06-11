const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  seatsBooked: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["paid", "unpaid"], required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Payment", paymentSchema);
