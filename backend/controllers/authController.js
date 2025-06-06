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
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, role),
      role,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

module.exports = {
  registerUser,
  registerOrganizer,
  login,
  createDefaultAdmin,
};
