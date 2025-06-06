const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { createDefaultAdmin } = require("./controllers/authController");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();
createDefaultAdmin(); // ⚠️ Creates default admin if not exists

// Routes
app.use("/api/auth", authRoutes);

// Server start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
