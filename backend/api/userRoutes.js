const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Adjust path if necessary

// CREATE a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all users
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all users...");
    const users = await User.find().maxTimeMS(30000);
    console.log("Users retrieved:", users);
    res.status(200).json({
      message: "OK",
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// READ a specific user by email
router.get("/:email", async (req, res) => {
  console.log(`GET /users/${req.params.email} called`);
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a user's email, username, or add optimization history
// UPDATE a user's email, username, or add optimization history
router.put("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's email and username if provided
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.username) {
      user.username = req.body.username;
    }

    // Add a new optimization record if provided
    if (req.body.optimizationHistory) {
      let optimizationHistory = req.body.optimizationHistory;

      // Ensure optimizationHistory is always an array, even if it's a single object
      if (!Array.isArray(optimizationHistory)) {
        optimizationHistory = [optimizationHistory]; // Wrap single object into an array
      }

      // Validate each optimization record
      optimizationHistory.forEach((record) => {
        if (!record.fileName && !record.code && !record.score) {
          console.error("Invalid optimization record:", record);
          throw new Error("Invalid optimization record. Must include fileName, code, or score.");
        }
      });

      // If the user doesn't have an optimizationHistory array, initialize it
      if (!user.optimizationHistory) {
        user.optimizationHistory = [];
      }

      // Push all the records into the optimizationHistory array
      user.optimizationHistory.push(...optimizationHistory);
    }

    // Save updated user data
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE a user by email
router.delete("/:email", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ email: req.params.email });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
