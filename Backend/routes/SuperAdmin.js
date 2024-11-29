const express = require('express');
const superAdminController = require('../controllers/superAdminController');
const router = express.Router();

// Existing routes
router.post('/register', superAdminController.registerSuperAdmin);
router.post('/login', superAdminController.loggedIn);
router.post('/createAdmin', superAdminController.createAdmin);

// New routes for fetching, updating, and deleting admins
router.get('/getAdmins', superAdminController.getAllAdmins);      // Fetch all admins
router.put('/updateAdmin', superAdminController.updateAdmin);     // Update an admin
router.delete('/deleteAdmin/:id', superAdminController.deleteAdmin); // Delete an admin

module.exports = router;
