import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
import cookieParser from "cookie-parser";
import authenticate from "./middleware/authenticate.js";





dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated!",
    user: req.user
  });
});

// ✅ Sync DB and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    await sequelize.sync({ alter: true });
    console.log("✅ All models synchronized successfully!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
export default app;