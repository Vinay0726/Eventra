const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const Event = require("../models/Event");
const Registration = require("../models/User"); // Assumes a registration model

// Submit feedback
router.post("/submit", async (req, res) => {
  try {
    const { userId, name, email, eventId, message } = req.body;

    if (
      !userId ||
      !name ||
      !email ||
      !eventId ||
      !message ||
      message.trim() === ""
    ) {
      return res.status(400).json({
        error: "User ID, name, email, event ID, and message are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(eventId)
    ) {
      return res.status(400).json({ error: "Invalid User ID or Event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const feedback = new Feedback({
      userId,
      eventId,
      name,
      email,
      message,
      submittedAt: new Date(),
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// @desc    Get feedback for organizer's events (No auth, organizerId in query)
router.get("/organizer", async (req, res) => {
  try {
    const organizerId = req.query.organizerId;

    if (!organizerId) {
      return res.status(400).json({ error: "Organizer ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(organizerId)) {
      return res.status(400).json({ error: "Invalid Organizer ID" });
    }

    const events = await Event.find({ organizerId });
    if (events.length === 0) {
      return res.status(200).json({ message: "No events found for this organizer", feedback: [] });
    }

    const eventIds = events.map(event => event._id);
    const feedback = await Feedback.find({ eventId: { $in: eventIds } })
      .populate("eventId", "name")
      .populate("userId", "name")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      message: feedback.length > 0 ? "Feedback fetched successfully" : "No feedback found for your events",
      feedback,
    });
  } catch (error) {
    console.error("Error fetching organizer feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// @desc    Get all feedback (Public, for homepage)
router.get("/public", async (req, res) => {
    try {
      const feedback = await Feedback.find()
        .populate("eventId", "name")
        .populate("userId", "name")
        .sort({ submittedAt: -1 });
  
      const filteredFeedback = feedback
        .filter(f => f.eventId && f.userId) // Exclude feedback with missing event or user
        .map(f => ({
          _id: f._id,
          eventName: f.eventId.name,
          userName: f.userId.name,
          message: f.message,
          submittedAt: f.submittedAt,
        }));
  
      res.status(200).json({
        message: filteredFeedback.length > 0 ? "Feedback fetched successfully" : "No feedback available",
        feedback: filteredFeedback,
      });
    } catch (error) {
      console.error("Error fetching public feedback:", error);
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });
  

// NEW: Get registered events for user
router.get("/registered-events", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const registrations = await Registration.find({ userId }).select("eventId");
    const eventIds = registrations.map((r) => r.eventId);
    const events = await Event.find({ _id: { $in: eventIds } }).select(
      "name date"
    );

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    res.status(500).json({ error: "Failed to fetch registered events" });
  }
});

module.exports = router;
