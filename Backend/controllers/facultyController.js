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
  const { id: teacher_id } = req.params; // Assuming teacher ID is passed as a query parameter

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
  const { status } = req.body;
  const { student_id } = req.params;

  const query = "Update std_leave_requests Set status = ? where student_id = ?";

  db.query(query, [status, student_id], (error, result) => {
    if (error) {
      return res.status(500).json({ Error: error });
    }
    return res.status(200).json({ "Updated successfully": result });
  });
};

const markAttendance = (req, res) => {
  const { student_id, status } = req.body;
  const { faculty_id } = req.params;

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

  // Get the current date (based on local timezone)
  // const date = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

  // Check if the student already has attendance for today
  const checkQuery = "SELECT * FROM attendance WHERE student_id = ?";

  db.query(checkQuery, [student_id], (err, result) => {
    if (err) {
      console.error("Error checking attendance:", err);
      return res.status(500).json({ error: "Error checking attendance." });
    }

    // If a record exists, prevent adding new attendance for the same date
    // if (result.length > 0) {
    //   return res
    //     .status(400)
    //     .json({ error: "Attendance already marked for this student today." });
    // }

    // Insert the attendance record into the database if not already marked
    const insertQuery =
      "INSERT INTO attendance (student_id, faculty_id, status) VALUES ( ?, ?, ?)";

    db.query(insertQuery, [student_id, faculty_id, status], (err) => {
      if (err) {
        console.error("Error inserting attendance:", err);
        return res.status(500).json({ error: "Failed to mark attendance." });
      }

      // Respond with success
      res.status(200).json({ message: "Attendance marked successfully." });
    });
  });
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
  db.query("SELECT * FROM attendance", [req.params.classId], (err, rows) => {
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

const addGrade = (req, res) => {
  const {
    student_id,
    subject,
    grade,
    classId,
    obtainedMarks,
    totalMarks,
    remarks,
  } = req.body; // Get data from request body
  const { faculty_id } = req.params; // Get faculty ID from route params

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
    INSERT INTO grades (student_id, classId, faculty_id, subject, obtainedMarks, totalMarks, grade, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
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

const assignAssignmentToClass = async (req, res) => {
  const { class_name, subject, title, description, due_date } = req.body;

  try {
    // Validate if the class exists in `class_assignments`
    const [classExists] = await db.query(
      "SELECT * FROM class_assignments WHERE class_name = ? AND subject = ?",
      [class_name, subject]
    );

    if (!classExists) {
      return res
        .status(400)
        .json({ message: "Class or subject does not exist." });
    }

    // Insert the assignment for the class
    await db.query(
      "INSERT INTO class_assignments_tasks (class_name, subject, title, description, due_date) VALUES (?, ?, ?, ?, ?)",
      [class_name, subject, title, description, due_date]
    );

    res
      .status(201)
      .json({ message: "Assignment successfully assigned to the class!" });
  } catch (error) {
    console.error("Error assigning assignment to class:", error);
    res.status(500).json({ message: "Failed to assign assignment to class." });
  }
};

const getClassDetails = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM class_assignments");

    if (!Array.isArray(rows)) {
      return res.status(500).json({ message: "Failed to fetch class details" });
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching class details:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching class details" });
  }
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
};
