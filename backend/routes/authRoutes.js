const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerOrganizer,
  login,
  getUserProfile,
  updateProfile,
  getOrganizerProfile,
  updateOrganizerProfile,
} = require("../controllers/authController");

router.post("/register/user", registerUser);
router.post("/register/organizer", registerOrganizer);
router.post("/login", login);
router.get("/user/:id", getUserProfile);
router.put("/user/:id", updateProfile);
router.get("/organizer/:id", getOrganizerProfile);
router.put("/organizer/:id", updateOrganizerProfile);



module.exports = router;
