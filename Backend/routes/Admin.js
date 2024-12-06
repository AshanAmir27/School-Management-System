const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin login route
router.post("/login", adminController.login);

// Faculty management routes
router.post("/faculty", adminController.createFaculty);
router.put("/faculty/:id", adminController.editFaculty);
router.delete("/faculty/:id", adminController.deleteFaculty);

// Admin assign class to faculty
router.post("/assign-class", adminController.assignClassToFaculty);

// Student management routes
router.post("/students", adminController.createStudent);
router.put("/students/:id", adminController.editStudent);
router.delete("/students/:id", adminController.deleteStudent);

// Parent management routes
router.post("/parents", adminController.createParent);
router.put("/parents/:id", adminController.editParent);
router.delete("/parents/:id", adminController.deleteParent);

// Leave management route
router.post("/approve-leave", adminController.approveLeave);

// Fee structure routes
router.post("/fees", adminController.createFeeStructure);
router.put("/fees/:id", adminController.updateFeeStructure);
router.get("/fees/all", adminController.getAllFeeStructures);
router.get("/fees/:id", adminController.getFeeStructure);
router.delete("/fees/:id", adminController.deleteFeeStructure);

// Routes for announcements
router.post("/createAnnouncement", adminController.createAnnouncement);
router.get("/getAnnouncements", adminController.getAnnouncements);
router.get("/getAnnouncement/:id", adminController.getAnnouncementById);
router.put("/updateAnnouncement/:id", adminController.updateAnnouncement);
router.delete("/deleteAnnouncement/:id", adminController.deleteAnnouncement);

// Add a fine
router.post("/student/:id/fine", adminController.addFineToStudent);

// Update a fine
router.put("/api/admin/student/:id/fine", adminController.updateFineForStudent);

// Delete a fine
router.delete(
  "/api/admin/student/:id/fine",
  adminController.deleteFineForStudent
);

// Generate fine slip
router.get(
  "/api/admin/student/:id/fine-slip",
  adminController.generateFineSlip
);

// Route for admin to add or update fee payment status for a student
router.post("/student/fee-payment", adminController.addFeePayment);

module.exports = router;
