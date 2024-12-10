const bcrypt = require("bcrypt");
const db = require("../config/db");

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

        res.status(200).json({
          message: "Login successful",
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
// function to view assigned classes
const viewAssignedClasses = (req, res) => {
  const { teacher_id } = req.query; // Assuming teacher ID is passed as a query parameter

  // Validate teacher_id
  if (!teacher_id) {
    return res.status(400).json({ error: "Teacher ID is required." });
  }

  // Query the database for assigned classes
  const query = `
    SELECT class_name, subject, time, room_no, year 
    FROM class_assignments 
    WHERE teacher_id = ?`;

  db.query(query, [teacher_id], (err, results) => {
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

const markAttendance = (req, res) => {
  const { student_id, status } = req.body; // Extract student_id and status from the request body
  const { faculty_id } = req.params; // Extract faculty_id from route params

  // Validate input fields
  if (!student_id || !status || !faculty_id) {
    return res
      .status(400)
      .json({ error: "Student ID, status, and faculty ID are required." });
  }

  // Ensure status is either 'present' or 'absent'
  if (!["Present", "Absent"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be 'Present' or 'Absent'." });
  }

  // Check if the student already has attendance (based only on student_id)
  const checkQuery = "SELECT * FROM attendance WHERE student_id = ?";

  db.query(checkQuery, [student_id], (err, result) => {
    if (err) {
      console.error("Error checking attendance:", err);
      return res.status(500).json({ error: "Error checking attendance." });
    }

    // If a record exists, prevent adding new attendance
    if (result.length > 0) {
      return res.status(400).json({
        error: "Attendance already marked for this student.",
      });
    }

    // Insert the attendance record into the database if not already marked
    const date = new Date().toISOString().slice(0, 10); // Get the current date (YYYY-MM-DD)

    const insertQuery =
      "INSERT INTO attendance (student_id, faculty_id, status, date) VALUES (?, ?, ?, ?)";

    db.query(
      insertQuery,
      [student_id, faculty_id, status, date],
      (err, result) => {
        if (err) {
          console.error("Error inserting attendance:", err);
          return res.status(500).json({ error: "Failed to mark attendance." });
        }

        // Respond with success
        res.status(200).json({ message: "Attendance marked successfully." });
      }
    );
  });
};

const updateAttendance = (req, res) => {
  const { student_id, status } = req.body; // Extract student_id and status from the request body
  const { faculty_id } = req.params; // Extract faculty_id from route params

  // Validate input fields
  if (!student_id || !status || !faculty_id) {
    return res
      .status(400)
      .json({ error: "Student ID, status, and faculty ID are required." });
  }

  // Ensure status is either 'present' or 'absent'
  if (!["Present", "Absent"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be 'Present' or 'Absent'." });
  }

  // Check if the attendance record exists for the specific student
  const checkQuery =
    "SELECT * FROM attendance WHERE student_id = ? AND faculty_id = ?";

  db.query(checkQuery, [student_id, faculty_id], (err, result) => {
    if (err) {
      console.error("Error checking attendance:", err);
      return res.status(500).json({ error: "Error checking attendance." });
    }

    // If no record exists for the student, return an error
    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "Attendance not found for this student." });
    }

    // Update the attendance record
    const updateQuery =
      "UPDATE attendance SET status = ? WHERE student_id = ? AND faculty_id = ?";

    db.query(updateQuery, [status, student_id, faculty_id], (err, result) => {
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
  const query = "Select * from attendance";

  db.query(query, (error, result) => {
    if (error) {
      return res.status(400).json({ errro: error });
    }
    return res.status(200).json({ attendance: result });
  });
};

// function to get leave
const getLeave = (req, res) => {
  const { faculty_id, leave_start_date, leave_end_date, leave_reason } =
    req.body;

  const query = `INSERT INTO leave_requests (faculty_id, leave_start_date, leave_end_date, leave_reason) 
                   VALUES (?, ?, ?, ?)`;

  db.query(
    query,
    [faculty_id, leave_start_date, leave_end_date, leave_reason],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .send("Error occurred while submitting the leave request");
      }
      res.status(200).send("Leave request submitted successfully");
    }
  );
};

// Function to add grades for a specific student
const addGrade = (req, res) => {
  const { student_id, subject, grade, classes, year } = req.body; // Get the data from the request body
  const { faculty_id } = req.params; // Get the faculty ID from the route params

  // Validate the input data
  if (!student_id || !subject || !grade || !classes || !year) {
    return res.status(400).json({
      error: "Student ID, subject, grade, classes, and year are required.",
    });
  }

  // Ensure that the grade is a valid value (you can add more validation if needed)
  if (!["A", "B", "C", "D", "F"].includes(grade)) {
    return res.status(400).json({ error: "Invalid grade value." });
  }

  // Ensure the faculty exists
  db.query(
    "SELECT * FROM faculty WHERE id = ?",
    [faculty_id],
    (err, facultyResults) => {
      if (err || facultyResults.length === 0) {
        return res.status(404).json({ error: "Faculty not found." });
      }

      // Ensure the student exists
      db.query(
        "SELECT * FROM students WHERE id = ?",
        [student_id],
        (err, studentResults) => {
          if (err || studentResults.length === 0) {
            return res.status(404).json({ error: "Student not found." });
          }

          // Insert the grade into the grades table
          const query = `
        INSERT INTO grades (student_id, faculty_id, subject, grade, classes, year)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

          db.query(
            query,
            [student_id, faculty_id, subject, grade, classes, year],
            (err, result) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ error: "Failed to insert grade." });
              }

              res.status(200).json({ message: "Grade added successfully." });
            }
          );
        }
      );
    }
  );
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

module.exports = {
  login,
  resetPassword,
  getStudentList,
  getLeave,
  markAttendance,
  updateAttendance,
  getAttendance,
  addGrade,
  updateLeaveRequestStatus,
  viewAssignedClasses,
  viewAnnouncements,
};
