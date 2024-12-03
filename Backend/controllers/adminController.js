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
    "SELECT * FROM admin WHERE username = ?",
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

// Function to create a faculty account
const createFaculty = (req, res) => {
  const { username, password, full_name, email, phone } = req.body;

  if (!username || !password || !email || !full_name || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "SELECT * FROM faculty WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      db.query(
        "SELECT * FROM faculty WHERE email = ?",
        [email],
        (err, emailResults) => {
          if (err) return res.status(500).json({ error: err.message });

          if (emailResults.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
          }

          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: err.message });

            const query = `
              INSERT INTO faculty (username, password, full_name, email, phone)
              VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
              query,
              [username, hashedPassword, full_name, email, phone],
              (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                res.status(201).json({
                  message: "Faculty account created successfully",
                  faculty: {
                    id: result.insertId,
                    username,
                    full_name,
                    email,
                    phone,
                  },
                });
              }
            );
          });
        }
      );
    }
  );
};

// Function to edit a faculty account

const editFaculty = (req, res) => {
  const { id } = req.params;
  const { username, password, full_name, email, phone, department } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Faculty ID is required" });
  }

  // If password is provided, hash it
  let hashedPassword = password;
  if (password) {
    bcrypt.hash(password, 10, (err, hashed) => {
      if (err) return res.status(500).json({ error: err.message });

      hashedPassword = hashed; // Update hashed password

      // After hashing the password, proceed with updating the faculty
      const qry = `
        UPDATE faculty 
        SET username = ?, password = ?, full_name = ?, email = ?, phone = ?, department = ? 
        WHERE id = ?
      `;

      const queryParams = [
        username,
        hashedPassword,
        full_name,
        email,
        phone,
        department,
        id,
      ];

      db.query(qry, queryParams, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Faculty not found" });
        }

        res.status(200).json({ message: "Faculty updated successfully" });
      });
    });
  } else {
    // If password is not provided, simply update other fields
    const qry = `
      UPDATE faculty 
      SET username = ?, full_name = ?, email = ?, phone = ?, department = ? 
      WHERE id = ?
    `;

    const queryParams = [username, full_name, email, phone, department, id];

    db.query(qry, queryParams, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Faculty not found" });
      }

      res.status(200).json({ message: "Faculty updated successfully" });
    });
  }
};

// Function to delete a faculty account
const deleteFaculty = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Faculty ID is required" });
  }

  db.query("DELETE FROM faculty WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty deleted successfully" });
  });
};


const approveLeave = (req, res) => {
  const { leaveId, status } = req.body; // Get leave request ID and approval status from the request body

  // Validate inputs
  if (!leaveId || !status) {
      return res.status(400).json({ message: 'Leave ID and status are required.' });
  }

  // Query to update leave status
  const query = `
      UPDATE leave_requests 
      SET status = ? 
      WHERE id = ?
  `;

  // Execute the query
  db.query(query, [status, leaveId], (err, result) => {
      if (err) {
          console.error("Error updating leave request:", err);
          return res.status(500).json({ message: 'Internal server error.' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Leave request not found.' });
      }

      // Respond with success
      return res.status(200).json({ message: 'Leave request updated successfully.' });
  });
};


// Function to create a student account
const createStudent = (req, res) => {
  const {
    username,
    password,
    full_name,
    email,
    phone,
    class: studentClass,
  } = req.body;

  if (!username || !password || !full_name || !email || !studentClass) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "SELECT * FROM students WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err.message });

        const query = `
        INSERT INTO students (username, password, full_name, email, phone, class)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

        db.query(
          query,
          [username, hashedPassword, full_name, email, phone, studentClass],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
              message: "Student account created successfully",
              student: {
                id: result.insertId,
                username,
                full_name,
                email,
                class: studentClass,
              },
            });
          }
        );
      });
    }
  );
};

// Function to edit a student account
const editStudent = (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, class: studentClass, password } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  // If password is provided, hash it
  let hashedPassword = password;
  if (password) {
    bcrypt.hash(password, 10, (err, hashed) => {
      if (err) return res.status(500).json({ error: err.message });

      hashedPassword = hashed; // Update hashed password

      // After hashing the password, proceed with updating the student
      db.query(
        "UPDATE students SET full_name = ?, email = ?, phone = ?, class = ?, password = ? WHERE id = ?",
        [full_name, email, phone, studentClass, hashedPassword, id],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found" });
          }

          res.status(200).json({ message: "Student updated successfully" });
        }
      );
    });
  } else {
    // If password is not provided, simply update other fields
    db.query(
      "UPDATE students SET full_name = ?, email = ?, phone = ?, class = ? WHERE id = ?",
      [full_name, email, phone, studentClass, id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json({ message: "Student updated successfully" });
      }
    );
  }
};
// Function to delete a student account
const deleteStudent = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  db.query("DELETE FROM students WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  });
};

// Function to create a parent account
const createParent = (req, res) => {
  const { username, password, full_name, email, phone, student_id } = req.body;

  if (!username || !password || !full_name || !email || !student_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "SELECT * FROM parents WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err.message });

        const query = `
          INSERT INTO parents (username, password, full_name, email, phone, student_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
          query,
          [username, hashedPassword, full_name, email, phone, student_id],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
              message: "Parent account created successfully",
              parent: {
                id: result.insertId,
                username,
                full_name,
                email,
                phone,
                student_id,
              },
            });
          }
        );
      });
    }
  );
};

// Function to edit a parent account
const editParent = (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, student_id, password } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Parent ID is required" });
  }

  // If password is provided, hash it
  let hashedPassword = password;
  if (password) {
    bcrypt.hash(password, 10, (err, hashed) => {
      if (err) return res.status(500).json({ error: err.message });

      hashedPassword = hashed; // Update hashed password

      // After hashing the password, proceed with updating the parent
      const qry = `
        UPDATE parents 
        SET full_name = ?, email = ?, phone = ?, student_id = ?, password = ? 
        WHERE id = ?
      `;

      const queryParams = [
        full_name,
        email,
        phone,
        student_id,
        hashedPassword,
        id,
      ];

      db.query(qry, queryParams, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Parent not found" });
        }

        res.status(200).json({ message: "Parent updated successfully" });
      });
    });
  } else {
    // If password is not provided, simply update other fields
    const qry = `
      UPDATE parents 
      SET full_name = ?, email = ?, phone = ?, student_id = ? 
      WHERE id = ?
    `;

    const queryParams = [full_name, email, phone, student_id, id];

    db.query(qry, queryParams, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Parent not found" });
      }

      res.status(200).json({ message: "Parent updated successfully" });
    });
  }
};

// Function to delete a parent account
const deleteParent = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Parent ID is required" });
  }

  db.query("DELETE FROM parents WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Parent not found" });
    }

    res.status(200).json({ message: "Parent deleted successfully" });
  });
};


// function to create a fee structure
const createFeeStructure = (req, res) => {
  const { class: class_name, amount, academic_year } = req.body;

  if (!class_name || !amount || !academic_year) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO fee_structures (class, amount, academic_year)
    VALUES (?, ?, ?)
  `;

  db.query(query, [class_name, amount, academic_year], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: "Fee structure created successfully",
      feeStructure: {
        id: result.insertId,
        class_name,
        amount,
        academic_year,
      },
    });
  });
};

// function to update a fee structure
const updateFeeStructure = (req, res) => {
  const { id } = req.params;
  const { class: class_name, amount, academic_year } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Fee structure ID is required" });
  }

  console.log("Received data:", req.body); // Log the incoming request body

  // Logging the query and params
  const query =
    "UPDATE fee_structures SET class = ?, amount = ?, academic_year = ? WHERE id = ?";
  console.log("Query:", query);
  console.log("Params:", [class_name, amount, academic_year, id]);

  db.query(query, [class_name, amount, academic_year, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // Log the result of the query execution to check the affected rows
    console.log("Result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Fee structure not found" });
    }

    res.status(200).json({ message: "Fee structure updated successfully" });
  });
};

// function to get all fee structures
const getAllFeeStructures = (req, res) => {
  db.query("SELECT * FROM fee_structures", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({ feeStructures: results });
  });
};

// function to get a specific fee structure
const getFeeStructure = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Fee structure ID is required" });
  }

  db.query("SELECT * FROM fee_structures WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ error: "Fee structure not found" });
    }

    res.status(200).json({ feeStructure: result[0] });
  });
};

// function to delete a fee structure
const deleteFeeStructure = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Fee structure ID is required" });
  }

  db.query("DELETE FROM fee_structures WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Fee structure not found" });
    }

    res.status(200).json({ message: "Fee structure deleted successfully" });
  });
};

// Create an announcement
const createAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  try {
      // Execute the query
      const result = await db.execute(
          "INSERT INTO announcements (title, message) VALUES (?, ?)",
          [title, message]
      );

      // Access the `insertId` from the result
      res.status(201).json({
          message: "Announcement created successfully",
          id: result.insertId,
      });
  } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    console.log("Executing query: SELECT * FROM announcements");

    // Execute query and check result type
    const queryResult = await db.execute("SELECT * FROM announcements");
    console.log("Raw query result:", queryResult);

    if (!Array.isArray(queryResult) || queryResult.length < 2) {
      throw new Error("Unexpected query result format");
    }

    const [rows] = queryResult; // Extract rows
    console.log("Extracted rows:", rows);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error in getAnnouncements:", error.message);
    res.status(500).json({ message: "Failed to retrieve announcements" });
  }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
      const result = await db.execute("DELETE FROM announcements WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Announcement not found" });
      }
      res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete announcement" });
  }
};

// Export controller functions
module.exports = {
  login,
  createFaculty,
  editFaculty,
  deleteFaculty,
  createStudent,
  editStudent,
  deleteStudent,
  createParent,
  editParent,
  deleteParent,
  approveLeave,
  createFeeStructure,
  updateFeeStructure,
  getAllFeeStructures,
  getFeeStructure,
  deleteFeeStructure,
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement
};
