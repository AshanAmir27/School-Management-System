const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin login route
router.post('/login', adminController.login);

// Faculty management routes
router.post('/faculty', adminController.createFaculty);
router.put('/faculty/:id', adminController.editFaculty);
router.delete('/faculty/:id', adminController.deleteFaculty);

// Student management routes
router.post('/students', adminController.createStudent);
router.put('/students/:id', adminController.editStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Parent management routes
router.post('/parents', adminController.createParent);
router.put('/parents/:id', adminController.editParent);
router.delete('/parents/:id', adminController.deleteParent);

// View all accounts (filtered)
router.get('/faculty', adminController.getAllFaculty);
router.get('/students', adminController.getAllStudents);
router.get('/parents', adminController.getAllParents);


module.exports = router;
