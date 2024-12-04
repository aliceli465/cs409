// module.exports = function (app, router) {
//     // Load the home route (this will be accessible at /api)
//     app.use('/api', require('./home.js'));
  
//     // Load the users route (this will be accessible at /api/users)
//     app.use('/api/users', require('./userRoutes.js'));
  
//     // Load the tasks route (this will be accessible at /api/tasks)
//     app.use('/api/tasks', require('./taskRoutes.js'));
//   };

// module.exports = function (app) {
//     // Register the test route
//     // app.post('/api/users/test-indirect', (req, res) => {
//     //   console.log('POST /api/users/test-indirect route called from index.js');
//     //   res.status(200).json({ message: 'Indirect route test OK' });
//     // });

//     console.log('Registering /api/users and /api/tasks routes');
//     // Register other routes as needed
//     app.use('/api', require('./home.js'));
//     app.use('/api/users', require('./userRoutes.js'));
//     // app.use('/api/tasks', require('./taskRoutes.js'));
//   };
const userRoutes = require('./userRoutes');
module.exports = function (app) {
    console.log('Registering /api/users and /api/tasks routes');

    console.log('Registering /api/users and /api/tasks routes');
  
    // Register the home route
    app.use('/api', require('./home.js')());
  
    // Register the user routes
    app.use('/api/users', require('./userRoutes.js'));
  
  };
  
  
