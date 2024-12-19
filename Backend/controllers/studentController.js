const bcrypt = require("bcrypt");
const PDFDocument = require("pdfkit");
const db = require("../config/db");

// Function to handle student login
const login = (req, res) => {
  const { username, password } = req.body;

  // Check if username and password were provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Query the database to find the student with the provided username
  const query = "SELECT * FROM students WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error occurred." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    const student = results[0]; // Assuming username is unique, take the first match

    // Compare the hashed password from the database with the password from the request
    bcrypt.compare(password, student.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error comparing passwords." });
      }

      if (isMatch) {
        // Passwords match, login successful
        return res.status(200).json({ message: "Login successful", student });
      } else {
        // Passwords do not match
        return res.status(401).json({ message: "Invalid password." });
      }
    });
  });
};

// Function to handle student password reset
const resetPassword = (req, res) => {
  const { username, password } = req.body;

  // Check if username and password were provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Query the database to find the student with the provided username
  const query = "SELECT * FROM students WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error occurred." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Hash the new password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error hashing the password." });
      }

      // Update the student's password in the database with the hashed password
      const updateQuery = "UPDATE students SET password = ? WHERE username = ?";

      db.query(updateQuery, [hashedPassword, username], (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error updating password in the database." });
        }

        return res
          .status(200)
          .json({ message: "Password reset successfully." });
      });
    });
  });
};

// Function to fetch attendance for a specific student
const viewAttendance = (req, res) => {
  const { student_id } = req.params; // Get the student ID from the route params

  // Query to fetch attendance for the student
  const query = `
    SELECT a.date, a.status, f.full_name AS faculty_name 
    FROM attendance a
    JOIN faculty f ON a.faculty_id = f.id
    WHERE a.student_id = ?
    ORDER BY a.date DESC
  `;

  db.query(query, [student_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching attendance data." });
    }

    // Check if there is any attendance data for the student
    if (results.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    // Respond with the attendance data
    res.status(200).json({ attendance: results });
  });
};
// Function to fetch grades for a specific student
const viewGrades = (req, res) => {
  const { student_id } = req.params; // Get the student ID from the route params

  const query = `
    SELECT 
      g.subject, 
      g.grade, 
      g.obtainedMarks, 
      g.totalMarks, 
      g.percentage, 
      f.full_name AS faculty_name 
    FROM grades g
    JOIN faculty f ON g.faculty_id = f.id
    WHERE g.student_id = ?
    ORDER BY g.classId DESC, g.subject DESC
  `;

  db.query(query, [student_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching grade data." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No grade records found." });
    }

    res.status(200).json({ grades: results });
  });
};

const viewAssignments = (req, res) => {
  const query = "SELECT * FROM class_assignments_tasks";

  db.query(query, (error, result) => {
    if (error) {
      console.error("Error fetching tasks:", error);
      return res.status(400).json({ error: "Error fetching tasks" });
    }

    return res.status(200).json({ success: true, data: result });
  });
};

// Function to fetch the fee payment status for a student
const getFeeStatus = (req, res) => {
  const { id } = req.params; // Get the student ID from the request parameters

  // Query to get the fee payment status for the student
  const query = `
    SELECT amount_paid, total_amount, payment_status, due_date
    FROM fee_payment_status
    WHERE student_id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error occurred." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No fee payment record found for this student." });
    }

    // Return the fee status to the student
    res.status(200).json({
      message: "Fee status fetched successfully.",
      fee_status: results[0], // Returning the first record (assuming one entry per student)
    });
  });
};

// Function to submit a leave request for a student
const submitLeaveRequest = (req, res) => {
  const { student_id, leave_start_date, leave_end_date, leave_reason } =
    req.body;

  // Validate input
  if (!student_id || !leave_start_date || !leave_end_date || !leave_reason) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Check if the student exists
  db.query(
    "SELECT * FROM students WHERE id = ?",
    [student_id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error occurred." });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Student not found." });
      }

      // Insert the leave request into the database
      const query = `
      INSERT INTO std_leave_requests (student_id, leave_start_date, leave_end_date, leave_reason)
      VALUES (?, ?, ?, ?)
    `;

      db.query(
        query,
        [student_id, leave_start_date, leave_end_date, leave_reason],
        (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "Failed to submit leave request." });
          }

          return res.status(201).json({
            message: "Leave request submitted successfully.",
            leaveRequestId: result.insertId,
          });
        }
      );
    }
  );
};

// Function to get all announcements
const getAnnouncements = (req, res) => {
  // Query to fetch all announcements
  const query = "SELECT * FROM announcements ORDER BY created_at DESC"; // Fetch latest first

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching announcements:", err);
      return res.status(500).json({ error: "Database error occurred." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No announcements found." });
    }

    // Send the fetched announcements
    res.status(200).json({ announcements: results });
  });
};

// Function to get fines for a student
const getFines = (req, res) => {
  const { id } = req.params; // Student ID

  // Query to fetch fines for the student
  const query = "SELECT * FROM fines WHERE student_id = ? ";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching fines:", err);
      return res.status(500).json({ error: "Database error occurred." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No fines found for this student." });
    }

    // Return the list of fines
    res.status(200).json({ fines: results });
  });
};

// Function to download fine slip
const downloadFineSlip = (req, res) => {
  const { id } = req.params;

  // Query to fetch the student's fines
  const query =
    "SELECT * FROM fines WHERE student_id = ? AND status = 'unpaid'";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching fine slip data:", err);
      return res.status(500).json({ error: "Database error occurred." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No unpaid fines found for this student." });
    }

    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=fine-slip.pdf");

    doc.pipe(res);
    doc.fontSize(16).text("Fine Slip", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Student ID: ${id}`);
    doc.moveDown();

    results.forEach((fine, index) => {
      doc.text(`Fine #${index + 1}:`);
      doc.text(`  Reason: ${fine.reason}`);
      doc.text(`  Amount: $${fine.amount}`);
      doc.text(`  Date: ${fine.fine_date}`);
      doc.moveDown();
    });

    doc.end();
  });
};

const downloadFeeChallan = (req, res) => {
  const { student_id } = req.params; // Match the parameter name with the route

  const query = `SELECT * FROM fee_payment_status WHERE student_id = ? AND payment_status != 'paid'`;

  db.query(query, [student_id], (error, result) => {
    if (error) {
      return res
        .status(400)
        .json({ error: "Error fetching challan details", details: error });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No unpaid challans found for this student." });
    }

    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=fine-slip-${student_id}.pdf`
    );

    doc.pipe(res); // Pipe the PDF directly to the response
    doc.fontSize(16).text("Fee Challan", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Student ID: ${student_id}`);
    doc.moveDown();

    result.forEach((challan, index) => {
      doc.text(`Challan #${index + 1}:`);
      doc.text(`  Amount Paid: ${challan.amount_paid || "N/A"}`);
      doc.text(`  Total Amount: ${challan.total_amount || 0}`);
      doc.text(`  Payment Status: ${challan.payment_status || 0}`);
      doc.text(`  Due Date: ${challan.due_date || "Unknown"}`);
      doc.moveDown();
    });

    doc.end(); // Finalize the PDF and send it
  });
};

module.exports = {
  login,
  resetPassword,
  viewAssignments,
  viewAttendance,
  viewGrades,
  getFeeStatus,
  submitLeaveRequest,
  getAnnouncements,
  downloadFineSlip,
  getFines,
  downloadFeeChallan,
};
