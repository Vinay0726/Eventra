// routes/orgReportRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); 

const Event = require("../models/Event");
const Payment = require("../models/Payment");
const User = require("../models/User");

router.get("/org/:organizerId", async (req, res) => {
  try {
    const organizerId = new mongoose.Types.ObjectId(req.params.organizerId);

    const totalEvents = await Event.countDocuments({ organizerId });
    const approvedEvents = await Event.countDocuments({
      organizerId,
      status: "approved",
    });

    const allEvents = await Event.find({ organizerId }).select("_id");
    const eventIds = allEvents.map((e) => e._id);

    const registeredUsers = await Payment.countDocuments({
      eventId: { $in: eventIds },
    });

    const reports = await Payment.distinct("eventId", {
      eventId: { $in: eventIds },
    });

    res.json({
      totalEvents,
      registeredUsers,
      approvedEvents,
      reports: reports.length,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
  


router.get("/admin-dashboard", async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const pendingApprovals = await Event.countDocuments({ status: "pending" });
    const totalUsers = await User.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const paymentsToday = await Payment.find({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const transactionsToday = paymentsToday.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    

    res.json({
      totalEvents,
      pendingApprovals,
      totalUsers,
      transactionsToday,
     
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
