
const mongoose = require('mongoose'); 
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path if necessary

// CREATE a new user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all users
// router.get('/', async (req, res) => {
//   console.log('GET /users called');
//   try {
//     console.log('inside try');

//     const dbStatus = mongoose.connection.readyState;
//     console.log('MongoDB connection status:', dbStatus); 

//     const users = await User.find();
//     console.log('found users');
//     res.status(200).json(users);
//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.get('/', async (req, res) => {
  console.log('inside try');
  // res.status(200).json({ message: 'OK', data: [] });
  query={};
  try{
    const users=await User.countDocuments(query);
    response.data=users;
    return res.status(200).json(response); // Return response with count and no documents
  }
  catch (error) {
    console.error("Error fetching total count:", error);
    return res.status(500).json({ message: 'Error fetching total count', data: null });
  }
        
  // try {
  //   console.log('inside try');
  //   let query = {};

  //   console.log('Executing query:', query);
  //   const users = await User.find(query).maxTimeMS(30000);;
  //   console.log('Found users:', users);

  //   res.status(200).json({
  //     message: 'OK',
  //     data: {
  //       users: users
  //     }
  //   });

  // } catch (error) {
  //   console.error("Error fetching users:", error);
  //   res.status(500).json({
  //     message: 'Server error',
  //     error: error.message,
  //     stack: error.stack // This will provide more information about where the error occurs
  //   });
  // }
});


// READ a specific user by ID
router.get('/:id', async (req, res) => {
  console.log('GET /users id called');
  try {
    console.log('inside try');
    const user = await User.findById(req.params.id);
    console.log('found user');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a user's email or add optimization history
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update the user's details
    if (req.body.email) user.email = req.body.email;

    // Add a new optimization record if provided
    if (req.body.optimizationHistory) {
      user.optimizationHistory.push(req.body.optimizationHistory);
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
