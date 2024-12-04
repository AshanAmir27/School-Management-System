const express = require("express");
const superAdminController = require("../controllers/superAdminController");
const router = express.Router();

//Route to register super admin
router.post("/register", superAdminController.registerSuperAdmin);

//Route to login as super admin
router.post("/login", superAdminController.loggedIn);

//Route to add school
router.post("/addSchool", superAdminController.addSchool);

// Route to create new admin
router.post("/createAdmin", superAdminController.createAdmin);

// New routes for fetching, updating, and deleting admins

// Fetch all admins
router.get("/getAdmins", superAdminController.getAllAdmins);

// Update an admin
router.put("/updateAdmin", superAdminController.updateAdmin);

// Delete an admin
router.delete("/deleteAdmin/:id", superAdminController.deleteAdmin);

module.exports = router;
