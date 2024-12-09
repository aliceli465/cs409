import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./userRoutes.js"; // Import your user routes

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5051;
const mongoURI = process.env.ATLAS_URI || ""; // Mongo URI from .env

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json()); // For parsing JSON payloads

// Database connection function
async function connectToDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Timeout for MongoDB connection
    });
    console.log("MongoDB connection successful");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if DB connection fails
  }
}

// Routes
app.use("/api/users", userRoutes); // Register user routes

// Home route
app.get("/", (req, res) => {
  res.send("409 server lebron jamesss");
});

// Start the server after DB connection
connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

// 404 handler for unknown routes
app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found!" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err });
});
