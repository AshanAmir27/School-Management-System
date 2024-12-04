const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// student login route
router.post("/login", studentController.login);

// Password reset route
router.post("/reset", studentController.resetPassword);

// Route to view attendance for a specific student
router.get("/:student_id/attendance", studentController.viewAttendance);

// Route to view grades for a specific student
router.get("/:student_id/grades", studentController.viewGrades);

// Route to fetch fee payment status
router.get("/:id/fee-status", studentController.getFeeStatus);

// Route for student to submit a leave request
router.post("/leave-request", studentController.submitLeaveRequest);

// Route to get all announcements
router.get("/announcements", studentController.getAnnouncements);

// Route to view fines
router.get("/:id/fines", studentController.getFines);

// Route to download fine slip
router.get("/:id/fine-slip", studentController.downloadFineSlip);

module.exports = router;
