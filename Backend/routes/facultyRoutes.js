const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const { verifyToken } = require("../middleware/auth");

//Route to get logged in
router.post("/login", facultyController.login);

//Route to reset password
router.post("/reset-password", verifyToken, facultyController.resetPassword);

//Route to get leave
router.post("/leave-request", verifyToken, facultyController.getLeave);

router.get("/getStudentList", facultyController.getStudentList);

// Add route
router.post("/markAttendance", verifyToken, facultyController.markAttendance);

// Add route
router.get("/getAttendance", facultyController.getAttendance);

// Add the route
router.get("/getClasses", verifyToken, facultyController.getDistinctClasses);

// Add the route
router.get(
  "/getStudents/:classId",
  verifyToken,
  facultyController.getStudentsByClass
);

// Route to add grades for a specific student
router.post("/grades", verifyToken, facultyController.addGrade);

router.get("/getGrades", verifyToken, facultyController.viewGrade);

router.get("/getLeaveRequest", verifyToken, facultyController.getLeaveRequest);

router.put(
  "/updateLeaveStatus",
  verifyToken,
  facultyController.updateLeaveStatus
);

// Admin should update leave request status
router.put(
  "/leave-request/:leave_request_id/status",
  facultyController.updateLeaveRequestStatus
);

// Route to view assigned classes
router.get("/classes", verifyToken, facultyController.viewAssignedClasses);

router.post(
  "/assign-class-assignment",
  verifyToken,
  facultyController.assignAssignmentToClass
);
router.get(
  "/get-class-details",
  verifyToken,
  facultyController.getClassDetails
);

// Route to view announcements
router.get("/announcements", facultyController.viewAnnouncements);

module.exports = router;
