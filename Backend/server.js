const express = require('express');
const cors = require('cors');
const superAdminRoutes = require('./routes/SuperAdmin'); // Import super admin routes
const adminRoutes = require('./routes/Admin');

const app = express();
const port = 5000;

// Middleware to allow CORS
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Use the super admin routes for login
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
