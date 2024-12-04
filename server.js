// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const secrets = require('./backend/config/secrets.js');
const bodyParser = require('body-parser');
const User = require('./backend/models/User');

const app = express();
const port = process.env.PORT || 4000;

mongoose.set('debug', true);
mongoose.set('bufferCommands', false); 
// mongoose.connect(secrets.mongo_connection, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB connection successful');
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });
mongoose.connect(secrets.mongo_connection, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000})
.then(async () => {
  console.log('MongoDB2 connection successful');
  console.log('Connected to database:', mongoose.connection.db.databaseName);
  const dbStatus = mongoose.connection.readyState;
  console.log('MongoDB connection status:', dbStatus);
  // try {
  //   const dbStatus = mongoose.connection.readyState;
  //   console.log('MongoDB connection status:', dbStatus);
  //   const count = await User.countDocuments({});
  //   console.log('User count:', count);
  // } catch (err) {
  //   console.error('Error counting users:', err);
  // }
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

// Directly register userRoutes
// const userRoutes = require('./routes/userRoutes'); // Import userRoutes directly
// app.use('/api/users', userRoutes); // Register userRoutes directly

const indexRoutes = require('./backend/routes/index'); 
indexRoutes(app);

app.get('*', (req, res) => {
  res.status(404).json({ message: "Route not found!" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
