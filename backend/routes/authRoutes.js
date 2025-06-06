const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerOrganizer,
  login,
} = require("../controllers/authController");

router.post("/register/user", registerUser);
router.post("/register/organizer", registerOrganizer);
router.post("/login", login);

module.exports = router;
