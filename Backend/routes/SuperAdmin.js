const express = require("express");
const superAdminController = require("../controllers/superAdminController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

//Route to register super admin
router.post("/register", superAdminController.registerSuperAdmin);

//Route to login as super admin
router.post("/login", superAdminController.loggedIn);

//Route to add school
router.post(
  "/addSchool",
  verifyToken, // First verify the token
  superAdminController.addSchool
);

// Password reset route
router.post("/reset", superAdminController.resetPassword);

router.get("/getSchools", superAdminController.getSchool);

router.put("/:id/updateSchools", superAdminController.updateSchool);

router.delete("/:id/deleteSchools", superAdminController.deleteSchool);

// Route to create new admin
router.post("/createAdmin", verifyToken, superAdminController.createAdmin);

// Fetch all admins
router.get("/getAdmins", superAdminController.getAllAdmins);

// Update an admin
router.put("/:id/updateAdmin", superAdminController.updateAdmin);

// Delete an admin
router.delete("/deleteAdmin/:id", superAdminController.deleteAdmin);

module.exports = router;
