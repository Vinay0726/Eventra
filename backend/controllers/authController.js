const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Organizer = require("../models/Organizer");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// Auto-create a default admin (if not exists)
const createDefaultAdmin = async () => {
  const adminExists = await Admin.findOne({ email: "admin@eventra.com" });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await Admin.create({
      name: "Super Admin",
      mobile: "9999999999",
      email: "admin@eventra.com",
      password: hashedPassword,
    });
    console.log("✅ Default Admin Created");
  }
};

// USER REGISTER
const registerUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id, "user"),
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// ORGANIZER REGISTER
const registerOrganizer = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    const existingOrg = await Organizer.findOne({ email });
    if (existingOrg)
      return res.status(400).json({ message: "Organizer already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOrg = await Organizer.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: newOrg._id,
      name: newOrg.name,
      email: newOrg.email,
      token: generateToken(newOrg._id, "organizer"),
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// LOGIN for all roles
const login = async (req, res) => {
  const { email, password, role } = req.body;

  let model = null;
  if (role === "user") model = User;
  else if (role === "organizer") model = Organizer;
  else if (role === "admin") model = Admin;
  else return res.status(400).json({ message: "Invalid role" });

  try {
    const user = await model.findOne({ email });
    if (!user) return res.status(404).json({ message: "Account not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, role),
      role,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user details", error: error.message });
  }
};
const updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { name, mobile, currentPassword, newPassword, confirmPassword } =
    req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic info
    user.name = name ?? user.name;
    user.mobile = mobile ?? user.mobile;

    // If password update requested
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res
          .status(400)
          .json({ message: "All password fields are required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};

// ORGANIZER PROFILE GET
const getOrganizerProfile = async (req, res) => {
  const organizerId = req.params.id;

  try {
    const organizer = await Organizer.findById(organizerId).select("-password");
    if (!organizer)
      return res.status(404).json({ message: "Organizer not found" });

    res.status(200).json(organizer);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch organizer details",
      error: error.message,
    });
  }
};

// ORGANIZER PROFILE UPDATE
const updateOrganizerProfile = async (req, res) => {
  const organizerId = req.params.id;
  const { name, mobile, currentPassword, newPassword, confirmPassword } =
    req.body;

  try {
    const organizer = await Organizer.findById(organizerId);
    if (!organizer)
      return res.status(404).json({ message: "Organizer not found" });

    // Update basic info
    organizer.name = name ?? organizer.name;
    organizer.mobile = mobile ?? organizer.mobile;

    // If password update requested
    if (currentPassword || newPassword || confirmPassword) {
      
      const isMatch = await bcrypt.compare(currentPassword, organizer.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      organizer.password = hashedPassword;
    }

    const updatedOrg = await organizer.save();

    res.status(200).json({
      _id: updatedOrg._id,
      name: updatedOrg.name,
      email: updatedOrg.email,
      mobile: updatedOrg.mobile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};

module.exports = {
  registerUser,
  registerOrganizer,
  login,
  createDefaultAdmin,
  getUserProfile,
  updateProfile,
  getOrganizerProfile, 
  updateOrganizerProfile,
};
