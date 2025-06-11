const User = require("../models/User");

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// UPDATE user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, mobile, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "✅ User updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to update user" });
  }
};

// DELETE user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "🗑️ User deleted" });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to delete user" });
  }
};
