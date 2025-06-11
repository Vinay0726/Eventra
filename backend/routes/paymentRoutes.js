const express = require("express");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Event = require("../models/Event");
const Payment = require("../models/Payment");

// Stripe checkout & book seats
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, eventId, seats } = req.body;
    console.log("Request Body:", req.body);
    if (!eventId || !seats || isNaN(seats) || seats <= 0) {
      return res
        .status(400)
        .json({ error: "Valid eventId and seats are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (!event.isPaid) {
      return res.status(400).json({ error: "Event is not a paid event" });
    }
    if (
      !event.ticketPrice ||
      isNaN(event.ticketPrice) ||
      event.ticketPrice <= 0
    ) {
      return res.status(400).json({ error: "Invalid ticket price" });
    }
    if (event.availableTickets < seats) {
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    const amount = event.ticketPrice * seats * 100; // Amount in cents
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: event.name,
              description: event.description,
            },
            unit_amount: event.ticketPrice * 100, // Price per seat in cents
          },
          quantity: seats,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "http://localhost:5173/payment/" + eventId + "?seats=" + seats,
      metadata: {
        userId: userId || "default_user_id", // Use the actual userId if available
        eventId: eventId,
        seats: seats.toString(),
      },
    });

    console.log("Checkout Session created:", session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout session error:", error.message, error.code);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Confirm checkout session and save payment
router.post("/confirm-checkout", async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const { userId, eventId, seats } = session.metadata;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.availableTickets < parseInt(seats)) {
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    event.availableTickets -= parseInt(seats);
    await event.save();

    const payment = new Payment({
      userId,
      eventId,
      amount: session.amount_total / 100, // Convert back to rupees
      seatsBooked: parseInt(seats),
      status: "paid",
      paymentIntentId: session.payment_intent,
    });
    await payment.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Payment confirmed and registration complete",
      });
  } catch (error) {
    console.error("Error confirming checkout:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// For FREE events - 
router.post("/register", async (req, res) => {
  try {
    const { eventId, seats, userId } = req.body;
    
    // Validate required fields
    if (!eventId || !seats || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableTickets < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Update available tickets
    event.availableTickets -= seats;
    await event.save();

    // Create payment record
    const payment = new Payment({
      userId,
      eventId,
      seatsBooked: seats,
      amount: 0,
      status: "unpaid",
    });
    await payment.save();

    res.status(201).json({ 
      success: true,
      message: "Registered successfully (free event)", 
      payment 
    });
  } catch (error) {
    console.error("Free registration error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
});

//for user payment history
router.get("/history/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const payments = await Payment.find({ userId })
      .populate("eventId", "name date time venue")
      .sort({ createdAt: -1 }); // recent first

    res.json({ success: true, payments });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
});

//user registerd events
router.get("/registered/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const registeredEvents = await Payment.find({ userId })
      .populate("eventId", "name category date time venue isPaid ticketPrice")
      .sort({ createdAt: -1 });

    res.json({ success: true, events: registeredEvents.map((p) => p.eventId) });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    res.status(500).json({ error: "Failed to fetch registered events" });
  }
});

//for organizer payment history 
router.get("/organizer/:organizerId", async (req, res) => {
  try {
    const { organizerId } = req.params;
    const payments = await Payment.find().populate("userId", "name").populate({
      path: "eventId",
      match: { organizerId },
      select: "name organizerId",
    });

    const filtered = payments.filter((p) => p.eventId); // remove null events (not organizer's)
    res.json({ success: true, payments: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

//get all payment for admin
router.get("/all", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name")
      .populate("eventId", "name");

    res.json({ success: true, payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

module.exports = router;
