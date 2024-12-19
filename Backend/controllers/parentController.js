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

  const query = "SELECT * FROM parents WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
    });
  });
};

const resetPassword = (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and new password are required." });
  }

  // Check if the user exists
  db.query(
    "SELECT * FROM parents WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).json({ error: "Database error occurred." });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      // Hash the new password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res
            .status(500)
            .json({ error: "Failed to hash the password." });
        }

        // Update the password in the database
        db.query(
          "UPDATE parents SET password = ? WHERE username = ?",
          [hashedPassword, username],
          (err, result) => {
            if (err) {
              console.error("Error updating password:", err);
              return res
                .status(500)
                .json({ error: "Failed to update password." });
            }

            res.status(200).json({ message: "Password reset successfully." });
          }
        );
      });
    }
  );
};

const viewChildAttendance = (req, res) => {
  const { child_id } = req.params; // Get the child_id from route params

  // Validate if child_id is provided
  if (!child_id) {
    return res.status(400).json({ error: "Child ID is required." });
  }

  // Query the database to fetch the child's attendance records, including student name
  db.query(
    `SELECT a.date, a.status, f.full_name AS faculty_name, s.full_name AS student_name
       FROM attendance a 
       JOIN faculty f ON a.faculty_id = f.id
       JOIN students s ON a.student_id = s.id
       WHERE a.student_id = ? 
       ORDER BY a.date DESC`,
    [child_id],
    (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).json({ error: "Database error occurred." });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "No attendance records found for this child." });
      }

      // Respond with the child's attendance records
      res.status(200).json({
        attendance: results,
      });
    }
  );
};

const getGrade = (req, res) => {
  const { child_id } = req.params.child_id;
  // Validate if child_id is provided
  if (!child_id) {
    return res.status(400).json({ error: "Child ID is required." });
  }

  db.query("Select * from grades where id=?", [child_id], (error, result) => {
    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ grades: result });
  });
};

const viewFee = (req, res) => {
  const [child_id] = req.params.child_id;

  if (!child_id) {
    return res.status(400).json({ error: "Child ID is required" });
  }

  db.query(
    "Select * from fee_payment_status where id=?",
    [child_id],
    (error, result) => {
      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({ fee: result });
    }
  );
};

const viewAnnouncement = (_, res) => {
  db.query("Select * from announcements", (error, result) => {
    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ announcement: result });
  });
};

const viewFine = (req, res) => {
  const [child_id] = req.params.child_id;

  if (!child_id) {
    return res.status(400).json({ error: "Child not found" });
  }
  const qry = "Select * from fines";

  db.query(qry, [child_id], (error, result) => {
    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ fine: result });
  });
};

module.exports = {
  login,
  resetPassword,
  viewChildAttendance,
  getGrade,
  viewFee,
  viewAnnouncement,
  viewFine,
};
