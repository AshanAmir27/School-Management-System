const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parentController");

// Route to get logged in
router.post("/login", parentController.login);

// Route to reset password
router.post("/reset-password", parentController.resetPassword);

// Route to view Child attendance
router.get("/:child_id/attendance", parentController.viewChildAttendance);

// Route to view child grades
router.get("/:child_id/grade", parentController.getGrade);

// Route to view Fine
router.get("/:child_id/viewFee", parentController.viewFee);

// Route to view announcements
router.get("/viewAnnouncement", parentController.viewAnnouncement);

module.exports = router;
