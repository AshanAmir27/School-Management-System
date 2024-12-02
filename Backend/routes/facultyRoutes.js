const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController")

router.post("/leave-request", facultyController.getLeave);

module.exports = router;
