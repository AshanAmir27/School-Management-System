const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin login route
router.post("/login", adminController.login);

// Faculty management routes
router.post("/faculty", adminController.createFaculty);
router.put("/faculty/:id", adminController.editFaculty);
router.delete("/faculty/:id", adminController.deleteFaculty);

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

// Fee management routes
router.post("/fees", adminController.createFeeStructure);
router.put("/fees/:id", adminController.updateFeeStructure);
router.get("/fees/all", adminController.getAllFeeStructures);
router.get("/fees/:id", adminController.getFeeStructure);
router.delete("/fees/:id", adminController.deleteFeeStructure);

// Announcement routes
router.post("/announcement", adminController.createAnnouncement);
router.get("/announcements", adminController.getAnnouncements);
router.delete("/announcement/:id", adminController.deleteAnnouncement);


module.exports = router;
