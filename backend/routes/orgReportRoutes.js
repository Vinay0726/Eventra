// routes/orgReportRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // ✅ CommonJS style for consistency

const Event = require("../models/Event");
const Payment = require("../models/Payment");
const User = require("../models/User");

// GET /api/org-report/:organizerId
router.get("/:organizerId", async (req, res) => {
  try {
    const organizerId = new mongoose.Types.ObjectId(req.params.organizerId); // ✅ moved inside

    // 1. Find events managed by organizer
    const events = await Event.find({ organizerId });

    if (events.length === 0) {
      return res.json({ success: true, reports: [] }); // 🔁 fixed key name to "reports"
    }

    // 2. Aggregate per-event registrations
    const reports = await Promise.all(
      events.map(async (event) => {
        const payments = await Payment.find({ eventId: event._id })
          .populate("userId", "name email")
          .lean();

        const users = payments.map((p) => ({
          paymentId: p._id,
          userId: p.userId?._id,
          name: p.userId?.name || "Unknown",
          email: p.userId?.email || "Unknown",
          seatsBooked: p.seatsBooked,
          amount: p.amount,
          paymentDate: p.createdAt,
        }));

        const totalUsers = users.length;
        const totalSeatsBooked = users.reduce(
          (sum, u) => sum + (u.seatsBooked || 0),
          0
        );
        const totalRevenue = users.reduce((sum, u) => sum + (u.amount || 0), 0);
        const remainingTickets = event.totalTickets - totalSeatsBooked;

        return {
          eventId: event._id,
          eventName: event.name,
          totalTickets: event.totalTickets,
          users,
          totalUsers,
          totalSeatsBooked,
          totalRevenue,
          remainingTickets,
        };
      })
    );

    res.json({ success: true, reports }); // ✅ use "reports" not "report"
  } catch (err) {
    console.error("Org report error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
