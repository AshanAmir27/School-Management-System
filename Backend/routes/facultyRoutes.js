const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

//Route to get logged in
router.post("/login", facultyController.login);

//Route to reset password
router.post("/reset-password", facultyController.resetPassword);

//Route to get leave
router.post("/leave-request", facultyController.getLeave);

// Route to mark attendance for a student
router.post(
  "/:faculty_id/mark-attendance",
  (req, _, next) => {
    console.log("Faculty ID:", req.params.faculty_id); // Debugging log
    console.log("Marking attendance for faculty_id:", req.params.faculty_id);
    next(); // Proceed to the actual handler
  },
  facultyController.markAttendance
);

// Route to add grades for a specific student
router.post("/:faculty_id/grades", facultyController.addGrade);

// Admin should update leave request status
router.put(
  "/leave-request/:leave_request_id/status",
  facultyController.updateLeaveRequestStatus
);

// Route to view assigned classes
router.get("/classes", facultyController.viewAssignedClasses);

// Route to view announcements
router.get("/announcements", facultyController.viewAnnouncements);

module.exports = router;
