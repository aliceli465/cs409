const express = require('express');
const secrets = require('../config/secrets');

// This exports the route properly
module.exports = () => {
  const router = express.Router();

  // Define the route for the home page
  router.get('/', (req, res) => {
    console.log('Request received at:', req.originalUrl);  // Log the request URL for debugging
    res.json({ message: 'Hello, world!' });
  });

  // Return the router instance
  return router;
};
