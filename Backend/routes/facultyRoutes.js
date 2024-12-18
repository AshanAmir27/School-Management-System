const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

//Route to get logged in
router.post("/login", facultyController.login);

//Route to reset password
router.post("/reset-password", facultyController.resetPassword);

//Route to get leave
router.post("/leave-request", facultyController.getLeave);

router.get("/getStudentList", facultyController.getStudentList);

router.get("/getAttendance", facultyController.getAttendance);

// Route to mark attendance for a student
router.post("/:faculty_id/mark-attendance", facultyController.markAttendance);

// Route to update attendance for a student
router.put(
  "/:faculty_id/update-attendance",
  facultyController.updateAttendance
);

// Route to add grades for a specific student
router.post("/:faculty_id/grades", facultyController.addGrade);

router.get("/getGrades", facultyController.viewGrade);

router.get("/getLeaveRequest", facultyController.getLeaveRequest);

router.put(
  "/:student_id/updateLeaveStatus",
  facultyController.updateLeaveStatus
);

// Admin should update leave request status
router.put(
  "/leave-request/:leave_request_id/status",
  facultyController.updateLeaveRequestStatus
);

// Route to view assigned classes
router.get("/:id/classes", facultyController.viewAssignedClasses);

router.post(
  "/assign-class-assignment",
  facultyController.assignAssignmentToClass
);
router.get("/get-class-details", facultyController.getClassDetails);

// Route to view announcements
router.get("/announcements", facultyController.viewAnnouncements);

module.exports = router;
