
const express = require("express");
const router = express.Router();
const Organizer = require("../models/Organizer");

// GET all organizers
router.get("/", async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.json(organizers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch organizers" });
  }
});

// DELETE organizer
router.delete("/:id", async (req, res) => {
  try {
    await Organizer.findByIdAndDelete(req.params.id);
    res.json({ message: "Organizer deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// UPDATE organizer
router.put("/:id", async (req, res) => {
  try {
    const updated = await Organizer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
