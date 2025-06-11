const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");

// @desc    Add new event (Organizer only)
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      date,
      time,
      venue,
      ticketType,
      ticketPrice,
      totalTickets,
      organizerId,
    } = req.body;

    // Basic validations
    if (
      !name ||
      !description ||
      !category ||
      !date ||
      !time ||
      !venue ||
      !organizerId
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    if (category.length < 6) {
      return res
        .status(400)
        .json({ error: "Category name must be at least 6 characters" });
    }

    const isPaid = ticketType === "paid";

    if (isPaid) {
      if (typeof ticketPrice !== "number" || ticketPrice <= 0) {
        return res.status(400).json({
          error: "Paid events must have a ticket price greater than 0",
        });
      }
      if (typeof totalTickets !== "number" || totalTickets <= 0) {
        return res
          .status(400)
          .json({ error: "Total tickets must be greater than 0" });
      }
    } else {
      if (typeof totalTickets !== "number" || totalTickets <= 0) {
        return res
          .status(400)
          .json({ error: "Total tickets must be greater than 0" });
      }
    }

    const newEvent = new Event({
      name,
      description,
      category,
      date,
      time,
      venue,
      isPaid,
      ticketPrice: isPaid ? ticketPrice : 0,
      totalTickets,
      availableTickets: totalTickets,
      organizerId,
      status: "pending",
    });

    await newEvent.save();

    res
      .status(201)
      .json({ message: "Event submitted for approval", event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all events for a specific organizer
router.get("/organizer/:organizerId", async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.params.organizerId });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// ✅ Update an event by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event updated", event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// ✅ Delete an event by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});
// ✅ Get all pending events (Admin only)
router.get("/admin/pending", async (req, res) => {
  try {
    const pendingEvents = await Event.find({ status: "pending" }).populate(
      "organizerId",
      "name"
    );
    // This populates only the 'name' field of organizer
    res.json(pendingEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pending events" });
  }
});

// ✅ Approve an event (Admin only)
router.put("/admin/approve/:eventId", async (req, res) => {
  try {
    const approvedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      { status: "approved" },
      { new: true }
    );

    if (!approvedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event approved successfully", event: approvedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to approve event" });
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizerId", "name email mobile") // populate organizer fields you want
      .exec();

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

//for user get all events
router.get("/public/approved", async (req, res) => {
  try {
    const approvedEvents = await Event.find({ status: "approved" })
      .populate("organizerId", "name") // Only include organizer name
      .exec();

    res.json(approvedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch approved events" });
  }
});


// ✅ Get a single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizerId", "name email mobile");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});



// @desc    Get registered users for a specific event (Organizer only)
router.get("/:eventId/registered-users", async (req, res) => {
  try {
    // Check if the event exists
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Fetch all payments for this event and populate user details
    const payments = await Payment.find({ eventId: req.params.eventId })
      .populate("userId", "name email")
      .exec();

    if (!payments || payments.length === 0) {
      return res.status(200).json({ message: "No users registered for this event", users: [] });
    }

    // Log payments for debugging
    console.log("Payments for event:", payments);

    // Map payments to a list of registered users with relevant details
    const registeredUsers = payments.map((payment) => {
      let paymentDate;
      try {
        paymentDate = payment.paymentDate && new Date(payment.paymentDate).toString() !== "Invalid Date"
          ? new Date(payment.paymentDate).toISOString()
          : new Date().toISOString(); // Fallback to current date
      } catch (error) {
        console.error("Invalid paymentDate for payment:", payment._id, payment.paymentDate);
        paymentDate = new Date().toISOString(); // Fallback in case of error
      }

      return {
        userId: payment.userId._id,
        name: payment.userId.name,
        email: payment.userId.email,
        seatsBooked: payment.seatsBooked || 1,
        paymentDate: paymentDate,
        amount: payment.amount || 0,
      };
    });

    res.json({ message: "Registered users fetched successfully", users: registeredUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch registered users" });
  }
});




// @desc    Send notification to all registered users of an event (Organizer only)
router.post("/:eventId/send-notification", async (req, res) => {
  try {
    const { message } = req.body;
    const eventId = req.params.eventId;

    // Validate request
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Notification message is required" });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if a notification with the same message has already been sent for this event
    const existingNotification = await Notification.findOne({
      eventId,
      message,
    });

    if (existingNotification) {
      return res.status(400).json({ error: "This notification message has already been sent for this event" });
    }

    // Fetch all registered users (via payments) to confirm there are users to notify
    const payments = await Payment.find({ eventId }).populate("userId", "name email");
    if (!payments || payments.length === 0) {
      return res.status(400).json({ error: "No users registered for this event" });
    }

    // Create a single notification for the event
    const notification = new Notification({
      eventId,
      message,
      sentAt: new Date(),
    });

    await notification.save();

    res.status(200).json({ message: "Notification sent successfully", count: payments.length });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// @desc    Get notifications for the logged-in user
router.get("/user/notifications", async (req, res) => {
  try {
    // Get userId from query parameters
    const userId = req.query.userId;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch payments for the user to get event IDs they are registered for
    const payments = await Payment.find({ userId });
    const eventIds = payments.map(payment => payment.eventId);

    if (eventIds.length === 0) {
      return res.status(200).json({ message: "No notifications found", notifications: [] });
    }

    // Fetch notifications for the events the user is registered for
    const notifications = await Notification.find({
      eventId: { $in: eventIds },
    })
      .populate("eventId", "name date time venue")
      .sort({ sentAt: -1 });

    res.status(200).json({ message: "Notifications fetched successfully", notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});


// GET: Get all notifications for an organizer's events
router.get("/organizer/notifications/:organizerId", async (req, res) => {
  try {
    const { organizerId } = req.params;

    const events = await Event.find({ organizerId }).select("_id");
    const eventIds = events.map((event) => event._id);

    const notifications = await Notification.find({
      eventId: { $in: eventIds },
    }).populate("eventId");

    if (notifications.length === 0) {
      return res.status(200).json({
        message: "You haven’t sent any notifications yet.",
        notifications: [],
      });
    }

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// PUT: Update a notification message
router.put("/notifications/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { message },
      { new: true }
    ).populate("eventId");

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ notification: updated });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// DELETE: Delete a notification
router.delete("/notifications/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;

    const deleted = await Notification.findByIdAndDelete(notificationId);

    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});


module.exports = router;
