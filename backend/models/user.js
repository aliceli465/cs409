const mongoose = require('mongoose');

// Define the Optimization History schema
const OptimizationHistorySchema = new mongoose.Schema({
  fileName: { type: String, required: true }, // Name of the file
  code: { type: String, required: true },    // The optimized code
  score: { type: Number, required: true },   // Optimization score
  date: { type: Date, default: Date.now }    // Timestamp of the optimization
});

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Username
  email: { type: String, required: true, unique: true },    // Email
  optimizationHistory: [OptimizationHistorySchema]          // Array of optimization records
}, {
  collection: 'users'  // Explicitly map to the 'user' collection in MongoDB
});

// Create and export the User model
module.exports = mongoose.model('User', UserSchema); 

