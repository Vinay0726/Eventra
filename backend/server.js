const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const orgReportRoutes = require("./routes/orgReportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
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

// Routes User
app.use("/api/users", userRoutes);

// Routes Organizer
app.use("/api/organizers", organizerRoutes);
 
// Organizer event management
app.use("/api/events", eventRoutes); 
// Organizer dashboard
app.use("/api/dashboard", dashboardRoutes);      


// Payment API route
app.use("/api/payment", paymentRoutes);

//for generate report
app.use("/api/org-report", orgReportRoutes);

//for feedback
app.use("/api/feedback", feedbackRoutes);

// Server start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
