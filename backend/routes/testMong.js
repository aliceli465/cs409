const mongoose = require('mongoose');
const User = require('../backend/models/user');  // Adjust path if needed

// Replace with your actual MongoDB connection string
const mongoConnectionString = "mongodb+srv://chicken:cs409finalproject123@cluster0.qzplo.mongodb.net/testing?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    
    // Create a new user object
    const testUser = new User({
      name: 'Test',
      email: 'test@example.com'
    });

    // Save the user to the database
    await testUser.save();
    console.log('Test user saved:', testUser);

    // Close the connection after the operation
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });