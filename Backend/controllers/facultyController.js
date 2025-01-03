const bcrypt = require("bcrypt");
const db = require("../config/db");
// const { json } = require("express");
const jwt = require("jsonwebtoken");
// const { generateToken } = require("../utils/jwt");

// Controller function to authenticate admin login
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  db.query(
    "SELECT * FROM faculty WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token with faculty details
        const token = jwt.sign(
          {
            id: results[0].id,
            username: results[0].username,
            school_id: results[0].school_id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          message: "Login successful",
          token,
        });
      });
    }
  );
};

// function to reset password
const resetPassword = (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      error: "Username and new password are required.",
    });
  }

  // Check if the username exists in the database
  db.query(
    "SELECT * FROM faculty WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error checking faculty:", err);
        return res.status(500).json({ error: "Database error occurred." });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Username not found." });
      }

      // Hash the new password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res
            .status(500)
            .json({ error: "Failed to hash the new password." });
        }

        // Update the password in the database
        db.query(
          "UPDATE faculty SET password = ? WHERE username = ?",
          [hashedPassword, username],
          (err, result) => {
            if (err) {
              console.error("Error updating password:", err);
              return res
                .status(500)
                .json({ error: "Failed to update password." });
            }

            res.status(200).json({
              message: "Password reset successfully.",
            });
          }
        );
      });
    }
  );
};

const getStudentList = (req, res) => {
  const query = "Select * from students";

  db.query(query, (error, result) => {
    if (error) {
      return res.status(400).json({ "Failed to fetch student List: ": error });
    }
    return res.status(200).json({ StudentList: result });
  });
};

const getDistinctClasses = (req, res) => {
  const { school_id } = req.user;

  db.query(
    "SELECT DISTINCT class FROM students where school_id = ?",
    [school_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching classes:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching classes" });
      }

      const classes = results.map((row) => row.class);
      res.status(200).json({ success: true, classes });
    }
  );
};

const getStudentsByClass = (req, res) => {
  const { classId } = req.params; // Use req.params instead of req.query
  console.log("Class id", classId);
  if (!classId) {
    return res
      .status(400)
      .json({ success: false, message: "Class ID is required" });
  }

  db.query(
    "SELECT id AS student_id, full_name, email FROM students WHERE class = ?",
    [classId],
    (err, results) => {
      if (err) {
        console.error("Error fetching students:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching students" });
      }

      res.status(200).json({ success: true, students: results });
    }
  );
};

const viewAssignedClasses = (req, res) => {
  const { school_id, id } = req.user;

  if (!id) {
    return res.status(400).json({ error: "Teacher ID is required." });
  }

  const query = `
    SELECT class_name, subject, time, room_no
    FROM class_assignments 
    WHERE id = ? AND school_id = ?`;

  db.query(query, [id, school_id], (err, results) => {
    if (err) {
      console.error("Error fetching classes:", err);
      return res.status(500).json({ error: "Database error occurred." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No assigned classes found." });
    }

    res.status(200).json({
      message: "Assigned classes retrieved successfully.",
      classes: results,
    });
  });
};

const getLeaveRequest = (req, res) => {
  const query = `Select * from std_leave_requests`;

  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({ Error: error });
    }
    return res.status(200).json({ request: result });
  });
};

const updateLeaveStatus = (req, res) => {
  const { student_id, status } = req.body;
  console.log(student_id);
  const query = "Update std_leave_requests Set status = ? where student_id = ?";

  db.query(query, [status, student_id], (error, result) => {
    if (error) {
      return res.status(500).json({ Error: error });
    }
    return res.status(200).json({ "Updated successfully": result });
  });
};

const markAttendance = (req, res) => {
  const { classId, attendance } = req.body;
  const { id: faculty_id, school_id } = req.user;
  console.log("Class Id ", classId);
  console.log("Attendance ", attendance);
  console.log("Faculty Id ", faculty_id);
  console.log("School Id ", school_id);

  if (!classId || !Array.isArray(attendance)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data" });
  }

  // Fetch students in the specified class
  db.query(
    "SELECT id FROM students WHERE class = ?",
    [classId],
    (err, students) => {
      if (err) {
        console.error("Error fetching students:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching students" });
      }

      if (!students.length) {
        return res
          .status(404)
          .json({ success: false, message: "No students found in the class" });
      }

      const studentIds = students.map((student) => student.id);

      // Validate attendance data against student IDs
      const validAttendance = attendance.filter((entry) =>
        studentIds.includes(entry.student_id)
      );

      if (!validAttendance.length) {
        return res.status(400).json({
          success: false,
          message: "No valid attendance records for this class",
        });
      }

      // Loop through valid attendance and update present/absent counts
      validAttendance.forEach((entry) => {
        const column = entry.status === "present" ? "present" : "absent"; // Decide column based on status

        // Check if the attendance record already exists for this student and faculty
        db.query(
          `SELECT * FROM attendance WHERE student_id = ? AND faculty_id = ?`,
          [entry.student_id, faculty_id],
          (err, result) => {
            if (err) {
              console.error("Error checking attendance:", err.message);
              return res
                .status(500)
                .json({ success: false, message: "Error checking attendance" });
            }

            if (result.length > 0) {
              // If attendance record exists, update it
              db.query(
                `UPDATE attendance SET ${column} = ${column} + 1 WHERE student_id = ? AND faculty_id = ?`,
                [entry.student_id, faculty_id],
                (err, result) => {
                  if (err) {
                    console.error("Error updating attendance:", err.message);
                    return res.status(500).json({
                      success: false,
                      message: "Error updating attendance",
                    });
                  }
                  console.log(
                    `Attendance for student ${entry.student_id} updated.`
                  );
                }
              );
            } else {
              // If no record exists, insert it
              db.query(
                `INSERT INTO attendance (school_id, student_id, faculty_id, present, absent) VALUES (?, ?, ?, ?, ?)`,
                [
                  school_id,
                  entry.student_id,
                  faculty_id,
                  entry.status === "present" ? 1 : 0,
                  entry.status === "absent" ? 1 : 0,
                ],
                (err, result) => {
                  if (err) {
                    console.error("Error inserting attendance:", err.message);
                    return res.status(500).json({
                      success: false,
                      message: "Error inserting attendance",
                    });
                  }
                  console.log(
                    `Attendance for student ${entry.student_id} inserted.`
                  );
                }
              );
            }
          }
        );
      });

      // Respond with success after all attendance is updated
      res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
      });
    }
  );
};

const updateAttendance = (req, res) => {
  const { student_id, status } = req.body; // Extract student_id and status from the request body
  const { faculty_id } = req.params; // Extract faculty_id from route params
  console.log("Received Body:", req.body);
  console.log("Received Params:", req.params);

  // Validate input fields
  if (!student_id || !status || !faculty_id) {
    return res
      .status(400)
      .json({ error: "Student ID, status, and faculty ID are required." });
  }

  if (!["Present", "Absent"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be 'Present' or 'Absent'." });
  }

  // Check if the attendance record exists for the specific student on the same date
  const checkQuery =
    "SELECT * FROM attendance WHERE student_id = ? AND faculty_id = ? ";

  db.query(checkQuery, [student_id, faculty_id], (err, result) => {
    if (err) {
      console.error("Error checking attendance:", err);
      return res.status(500).json({ error: "Error checking attendance." });
    }

    // If no record exists for the student on the same date, return an error
    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "Attendance not found for this student today." });
    }

    // Update the attendance record for the specific date
    const updateQuery =
      "UPDATE attendance SET status = ? WHERE student_id = ? AND faculty_id = ? ";

    db.query(updateQuery, [status, student_id, faculty_id], (err) => {
      if (err) {
        console.error("Error updating attendance:", err);
        return res.status(500).json({ error: "Failed to update attendance." });
      }

      // Respond with success
      res.status(200).json({ message: "Attendance updated successfully." });
    });
  });
};

const getAttendance = (req, res) => {
  const { classId } = req.query;

  if (!classId) {
    return res
      .status(400)
      .json({ success: false, message: "Class ID is required" });
  }

  db.query(
    `SELECT a.*, s.full_name, s.email 
     FROM attendance a
     INNER JOIN students s ON a.student_id = s.id
     WHERE s.class = ?`,
    [classId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching attendance:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching attendance" });
      }

      if (!rows || rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No attendance records found" });
      }

      res.status(200).json({ success: true, data: rows });
    }
  );
};

// function to get leave
const getLeave = (req, res) => {
  const { school_id, id: faculty_id } = req.user;
  const { leave_start_date, leave_end_date, leave_reason } = req.body;

  if (!leave_start_date || !leave_end_date || !leave_reason) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (new Date(leave_start_date) > new Date(leave_end_date)) {
    return res
      .status(400)
      .json({ error: "Leave start date cannot be after end date." });
  }

  const query = `
    INSERT INTO leave_requests (school_id, faculty_id, leave_start_date, leave_end_date, leave_reason) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [school_id, faculty_id, leave_start_date, leave_end_date, leave_reason],
    (err) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Database error occurred." });
      }
      res
        .status(200)
        .json({ message: "Leave request submitted successfully." });
    }
  );
};

const addGrade = (req, res) => {
  // id: results[0].id,
  // username: results[0].username,
  // school_id: results[0].school_id,

  const {
    student_id,
    subject,
    grade,
    classId,
    obtainedMarks,
    totalMarks,
    remarks,
  } = req.body;
  const { id: faculty_id, school_id } = req.user;
  console.log("Faculty Id", faculty_id);
  console.log("School Id", school_id);

  // Validate input
  if (
    !student_id ||
    !subject ||
    !grade ||
    !classId ||
    !obtainedMarks ||
    !totalMarks
  ) {
    return res.status(400).json({
      error:
        "Student ID, subject, grade, classes, obtainedMarks, and totalMarks are required.",
    });
  }

  // Ensure obtainedMarks and totalMarks are valid numbers and obtainedMarks <= totalMarks
  const obtained = parseFloat(obtainedMarks); // Convert obtainedMarks to number
  const total = parseFloat(totalMarks); // Convert totalMarks to number

  if (isNaN(obtained) || isNaN(total)) {
    return res.status(400).json({
      error: "Marks should be valid numbers.",
    });
  }

  if (obtained > total) {
    return res.status(400).json({
      error:
        "Invalid marks. Obtained marks must be less than or equal to total marks.",
    });
  }

  // SQL query to insert the grade
  const query = `
    INSERT INTO grades (school_id,student_id, classId, faculty_id, subject, obtainedMarks, totalMarks, grade, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      school_id,
      student_id,
      classId,
      faculty_id,
      subject,
      obtained,
      total,
      grade,
      remarks || null,
    ],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Failed to add grade." });
      }

      res.status(200).json({ message: "Grade added successfully." });
    }
  );
};

const viewGrade = (req, res) => {
  const query = "Select * from grades";

  db.query(query, (error, result) => {
    if (error) {
      return res.status(400).json({ "Failed to fetch grades": error });
    }
    return res.status(200).json({ grades: result });
  });
};

// function to update leave request status
const updateLeaveRequestStatus = (req, res) => {
  const { leave_request_id } = req.params; // Get leave request ID from URL params
  const { status } = req.body; // Status is sent in the request body (approved or rejected)

  // Validate status
  if (!["approved", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be 'approved' or 'rejected'." });
  }

  // Check if leave request exists in the database
  db.query(
    "SELECT * FROM std_leave_requests WHERE id = ?",
    [leave_request_id],
    (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).json({ error: "Database error occurred." });
      }

      if (results.length === 0) {
        console.log("Leave request not found with ID:", leave_request_id); // Log if request not found
        return res.status(404).json({ error: "Leave request not found." });
      }

      // Update leave request status
      const query = "UPDATE std_leave_requests SET status = ? WHERE id = ?";
      db.query(query, [status, leave_request_id], (err, result) => {
        if (err) {
          console.error("Error updating status:", err);
          return res
            .status(500)
            .json({ error: "Failed to update leave request status." });
        }

        return res
          .status(200)
          .json({ message: "Leave request status updated successfully." });
      });
    }
  );
};

//function vew announcements
const viewAnnouncements = (req, res) => {
  // Query to fetch all announcements from the database
  const query = "SELECT * FROM announcements ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching announcements:", err);
      return res.status(500).json({ error: "Failed to fetch announcements." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No announcements found." });
    }

    res.status(200).json({
      message: "Announcements fetched successfully.",
      announcements: results,
    });
  });
};

const assignAssignmentToClass = (req, res) => {
  const { school_id } = req.user; // Assuming school_id is extracted from the token

  const { class_name, subject, title, description, due_date } = req.body;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required." });
  }

  if (!class_name || !subject || !title || !description || !due_date) {
    return res
      .status(400)
      .json({ error: "All fields are required to assign an assignment." });
  }

  const query = `
    INSERT INTO class_assignments_tasks (school_id, class_name, subject, title, description, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [school_id, class_name, subject, title, description, due_date],
    (err, result) => {
      if (err) {
        console.error("Error assigning assignment:", err);
        return res.status(500).json({ error: "Failed to assign assignment." });
      }

      res.status(200).json({ message: "Assignment assigned successfully." });
    }
  );
};

const getClassDetails = (req, res) => {
  const { school_id } = req.user; // Assuming school_id is extracted from the token

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required." });
  }

  const query = `
    SELECT class_name, subject 
    FROM class_assignments 
    WHERE school_id = ? 
    GROUP BY class_name, subject
  `;

  db.query(query, [school_id], (err, results) => {
    if (err) {
      console.error("Error fetching class details:", err);
      return res.status(500).json({ error: "Failed to fetch class details." });
    }

    res.status(200).json({ data: results });
  });
};

module.exports = {
  login,
  resetPassword,
  getStudentList,
  getLeave,
  getLeaveRequest,
  updateLeaveStatus,
  markAttendance,
  updateAttendance,
  getAttendance,
  addGrade,
  viewGrade,
  updateLeaveRequestStatus,
  viewAssignedClasses,
  viewAnnouncements,
  assignAssignmentToClass,
  getClassDetails,

  getDistinctClasses,
  getStudentsByClass,
};
