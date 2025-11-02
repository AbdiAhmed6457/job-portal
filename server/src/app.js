// server/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sequelize from "./config/db.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
import StudentProfile from "./models/StudentProfile.js";

dotenv.config();

const app = express();

// =============================
// Middleware
// =============================
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// =============================
// Routes
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/student-profile", studentProfileRoutes);

// Test route 
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// =============================
// Database Connection & Sync
// =============================
const connectAndSyncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // This will automatically create or update tables if needed
    await sequelize.sync({ alter: true });
    console.log("🧩 All models synchronized successfully!");
  } catch (err) {
    console.error("❌ Database sync error:", err);
  }
};

connectAndSyncDB();

// =============================
// Export the app
// =============================
export default app;
