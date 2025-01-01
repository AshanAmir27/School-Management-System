const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middleware/auth");

// Admin login route
router.post("/login", adminController.login);

// Faculty management routes
router.post("/createFaculty", verifyToken, adminController.createFaculty);
router.get("/viewFaculty", verifyToken, adminController.getFaculty);
router.put("/faculty/:id", verifyToken, adminController.editFaculty);
router.delete("/faculty/:id", verifyToken, adminController.deleteFaculty);
router.get("/subject/:id", verifyToken, adminController.getSubjects);

router.get("/getSchoolId", verifyToken, adminController.getSchoolId);

// Admin assign class to faculty
router.post("/assign-class", verifyToken, adminController.assignClassToFaculty);
router.get(
  "/getAssignedClasses",
  verifyToken,
  adminController.getAssignedClasses
);

// Route to fetch all classes
router.get("/classes", adminController.getClasses);

// Route to fetch students by class or student_id
router.get("/students", adminController.getStudents);

// Student management routes
router.post("/students", verifyToken, adminController.createStudent);
router.get("/viewStudents", verifyToken, adminController.getStudent);
router.put("/students/:id", verifyToken, adminController.editStudent);
router.delete("/students/:id", verifyToken, adminController.deleteStudent);

// Parent management routes
router.post("/parents", verifyToken, adminController.createParent);
router.get("/viewParents", verifyToken, adminController.getParents);
router.put("/parents/:id", verifyToken, adminController.editParent);
router.delete("/parents/:id", verifyToken, adminController.deleteParent);

// Leave management route
router.put(
  "/updateLeaveStatus",
  verifyToken,
  adminController.updateLeaveStatus
);
router.get("/getLeave_request", verifyToken, adminController.getApproveLeave);

// Fee structure routes
router.post("/fees", verifyToken, adminController.createFeeStructure);
router.put("/fees/:id", verifyToken, adminController.updateFeeStructure);
router.get("/fees/all", verifyToken, adminController.getAllFeeStructures);
router.get("/fees/:id", verifyToken, adminController.getFeeStructure);
router.delete("/fees/:id", verifyToken, adminController.deleteFeeStructure);

// Routes for announcements
router.post(
  "/createAnnouncement",
  verifyToken,
  adminController.createAnnouncement
);
router.get("/getAnnouncements", verifyToken, adminController.getAnnouncements);
router.get(
  "/getAnnouncement/:id",
  verifyToken,
  adminController.getAnnouncementById
);
router.put(
  "/updateAnnouncement/:id",
  verifyToken,
  adminController.updateAnnouncement
);
router.delete(
  "/deleteAnnouncement/:id",
  verifyToken,
  adminController.deleteAnnouncement
);

// Add a fine
router.post(
  "/:student_id/addFine",
  verifyToken,
  adminController.addFineToStudent
);
router.get("/getFineDetail", verifyToken, adminController.getFineDetail);
// Update a fine
router.put(
  "/student/:id/fine",
  verifyToken,
  adminController.updateFineForStudent
);
// Delete a fine
router.delete("/:id/fine", adminController.deleteFineForStudent);

// Generate fine slip
router.get(
  "/api/admin/student/:id/fine-slip",
  adminController.generateFineSlip
);

// Route for admin to add or update fee payment status for a student
router.post("/student/fee-payment", adminController.addFeePayment);

router.get("/getFeeDetail", adminController.getFeeDetail);

module.exports = router;
