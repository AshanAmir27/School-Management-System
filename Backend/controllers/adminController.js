const bcrypt = require("bcrypt");
const db = require("../config/db");
const { query } = require("express");
const jwt = require("jsonwebtoken");

// Controller function to authenticate admin login
const login = (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Query the database for the admin
  db.query(
    "SELECT * FROM admin WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Compare the provided password with the hashed password from the database
      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token for the admin
        const token = jwt.sign(
          {
            id: results[0].id,
            username: results[0].username,
            role: "admin",
            school_id: results[0].school_id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Return success response with the token
        res.status(200).json({
          message: "Login successful",
          token, // Send the generated token back to the client
        });
      });
    }
  );
};

// Function to create a faculty account
const createFaculty = (req, res) => {
  const { schoolId, username, password, full_name, email, phone, department } =
    req.body;

  // Check if all required fields are provided
  if (
    !schoolId ||
    !username ||
    !password ||
    !full_name ||
    !email ||
    !phone ||
    !department
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if the username already exists
  db.query(
    "SELECT * FROM faculty WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Check if the email already exists
      db.query(
        "SELECT * FROM faculty WHERE email = ?",
        [email],
        (err, emailResults) => {
          if (err) return res.status(500).json({ error: err.message });

          if (emailResults.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
          }

          // Hash the password before saving it
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: err.message });

            // Prepare the query to insert the new faculty member
            const query = `
          INSERT INTO faculty (school_id, username, password, full_name, email, phone, department, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

            db.query(
              query,
              [
                schoolId,
                username,
                hashedPassword,
                full_name,
                email,
                phone,
                department,
              ],
              (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                // Return a success message with the faculty's details
                res.status(201).json({
                  message: "Faculty account created successfully",
                  faculty: {
                    id: result.insertId,
                    schoolId,
                    username,
                    full_name,
                    email,
                    phone,
                    department,
                    created_at: new Date().toISOString(), // Assuming 'created_at' is the current timestamp
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

const getFaculty = async (req, res) => {
  try {
    const { school_id } = req.user; // Extract school id from token payload

    if (!school_id) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    db.query(
      "SELECT * FROM faculty where school_id = ?",
      [school_id],
      (err, results) => {
        if (err) {
          console.error("Error fetching faculty:", err.message);
          return res
            .status(500)
            .json({ success: false, message: "Error fetching faculty" });
        }
        res.status(200).json({ success: true, data: results });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Unexpected error occurred" });
  }
};

// Function to delete a faculty account
const deleteFaculty = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Faculty ID is required" });
  }

  db.query("DELETE FROM faculty WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err); // Log the error for better debugging
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty deleted successfully" });
  });
};

const getApproveLeave = (req, res) => {
  const query = "SELECT * FROM leave_requests";

  db.query(query, (error, result) => {
    if (error) {
      return res.status(400).json({ Error: error });
    } else {
      return res.status(200).json({ request: result });
    }
  });
};

// Function to respond to  update leave status
const updateLeaveStatus = (req, res) => {
  const { id, status } = req.body;

  const query = "UPDATE leave_requests SET status = ? WHERE id = ?";
  db.query(query, [status, id], (error, result) => {
    if (error) {
      return res.status(400).json({ error: "Failed to update leave request" });
    }
    return res
      .status(200)
      .json({ result: "Leave request updated successfully" });
  });
};

// Function to create a student account
const createStudent = (req, res) => {
  const {
    schoolId,
    username,
    password,
    full_name,
    email,
    phone,
    classes: studentClass,
  } = req.body;

  if (!username || !password || !full_name || !email || !studentClass) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "SELECT * FROM students WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "Encryption error" });

        const query = `
          INSERT INTO students (school_id, username, password, full_name, email, phone, class)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          query,
          [
            schoolId,
            username,
            hashedPassword,
            full_name,
            email,
            phone,
            studentClass,
          ],
          (err, result) => {
            if (err) return res.status(500).json({ error: "Insertion error" });

            res.status(201).json({
              message: "Student account created successfully",
              student: {
                id: result.insertId,
                schoolId,
                username,
                full_name,
                email,
                phone,
                class: studentClass,
              },
            });
          }
        );
      });
    }
  );
};

const getStudent = (req, res) => {
  try {
    const { school_id } = req.user;

    if (!school_id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    db.query(
      "SELECT * FROM students WHERE school_id = ?",
      [school_id],
      (error, result) => {
        if (error) {
          console.error("Error fetching students", error.message);
          return res.status(500).json({ success: false, error: error.message });
        }
        res.status(200).json({
          success: true,
          message: "Student data fetched successfully",
          students: result,
        });
      }
    );
  } catch (error) {
    console.error("Unexpected error", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Function to edit a student account
const editStudent = async (req, res) => {
  const { id } = req.params;
  const {
    full_name,
    email,
    phone,
    class: studentClass,
    password,
    username,
  } = req.body;

  console.log("Received data:", req.body); // Log the data to check if it contains all the fields

  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  if (!full_name || !email || !phone || !studentClass || !username) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Proceed to update student data
    let query =
      "UPDATE students SET full_name = ?, email = ?, phone = ?, class = ? WHERE id = ?";
    let params = [full_name, email, phone, studentClass, id];

    // If password is provided, hash it and add it to the query
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query =
        "UPDATE students SET full_name = ?, email = ?, phone = ?, class = ?, password = ? WHERE id = ?";
      params = [full_name, email, phone, studentClass, hashedPassword, id];
    }

    db.query(query, params, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json({ message: "Student updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to delete a student account
const deleteStudent = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  console.log(`Deleting student with ID: ${id}`);

  db.query("DELETE FROM students WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Database error during DELETE operation:", err); // Log the error
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      console.log(`No student found with ID: ${id}`);
      return res.status(404).json({ error: "Student not found" });
    }

    console.log(`Student with ID: ${id} deleted successfully`);
    res.status(200).json({ message: "Student deleted successfully" });
  });
};

// Function to create a parent account
const createParent = (req, res) => {
  const { school_id, username, password, full_name, email, phone, student_id } =
    req.body;

  if (
    !school_id ||
    !username ||
    !password ||
    !full_name ||
    !email ||
    !phone ||
    !student_id
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkStudentQuery =
    "SELECT * FROM students WHERE id= ? AND school_id = ?";

  db.query(
    checkStudentQuery,
    [student_id, school_id],
    (error, studentResult) => {
      if (error) {
        console.log("Database error", error);
        return res.status(500).json({ error: "Database error" });
      }
      if (studentResult.length === 0) {
        return res
          .status(404)
          .json({ error: "Student not found in the specified school" });
      }

      // Check if parent exist with same student id
      const checkParentQuery = "Select * FROM parents where student_id = ?";
      db.query(checkParentQuery, [student_id], (error, parentResult) => {
        if (error) {
          console.error("Database error", error);
          return res.status(500).json({ error: "Database error" });
        }

        if (parentResult === 0) {
          return res
            .status(404)
            .json({ error: "Parent with this student id already exist" });
        }

        const insertParentQuery = `INSERT INTO parents(school_id, username, password, full_name, email, phone, student_id)
        VALUES (?,?,?,?,?, ?, ?)
      `;

        const user = [
          school_id,
          username,
          password,
          full_name,
          email,
          phone,
          student_id,
        ];
        db.query(insertParentQuery, user, (error, result) => {
          if (error) {
            console.error("Database error", error);
            return res
              .status(500)
              .json({ error: "Failed to to create parent account" });
          }

          res.status(201).json({
            message: "Parent account created successfully",
            result,
          });
        });
      });
    }
  );
};

const getParents = (req, res) => {
  try {
    const { school_id } = req.user;
    if (!school_id) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized access" });
    }

    const query = `Select * from parents where school_id = ?`;

    db.query(query, [school_id], (error, result) => {
      if (error) {
        console.error("Error fetching parents", error.message);
        return res.status(500).json({ success: false, error: error.message });
      }

      res
        .status(200)
        .json({ message: "Parent data fetched successfully", parents: result });
    });
  } catch (error) {
    console.error("Unexpected error", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
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
  const { school_id } = req.user;

  const { class: class_name, amount, academic_year } = req.body;

  if (!school_id || !class_name || !amount || !academic_year) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO fee_structures (school_id,class, amount, academic_year)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [school_id, class_name, amount, academic_year],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Fee structure created successfully",
        feeStructure: {
          id: result.insertId,
          school_id,
          class_name,
          amount,
          academic_year,
        },
      });
    }
  );
};

// function to update a fee structure
const updateFeeStructure = (req, res) => {
  const { school_id } = req.user;
  const { id } = req.params;
  const { class: class_name, amount, academic_year } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Fee structure ID is required" });
  }

  // Logging the query and params
  const query =
    "UPDATE fee_structures SET class = ?, amount = ?, academic_year = ? WHERE id = ? AND school_id = ?";

  db.query(
    query,
    [class_name, amount, academic_year, id, school_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Log the result of the query execution to check the affected rows
      console.log("Result:", result);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Fee structure not found" });
      }

      res.status(200).json({ message: "Fee structure updated successfully" });
    }
  );
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

// Create a new announcement
const createAnnouncement = (req, res) => {
  const { school_id } = req.user;
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required." });
  }

  const query =
    "INSERT INTO announcements (school_id, title, message) VALUES (?, ?, ?)";
  db.query(query, [school_id, title, message], (err, result) => {
    if (err) {
      console.error("Error creating announcement:", err);
      return res.status(500).json({ error: "Failed to create announcement." });
    }
    res.status(201).json({
      message: "Announcement created successfully!",
    });
  });
};

// Get all announcements
const getAnnouncements = (req, res) => {
  const query = "SELECT * FROM announcements ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching announcements:", err);
      return res
        .status(500)
        .json({ error: "Failed to retrieve announcements." });
    }
    res.status(200).json(results);
  });
};

// Get a single announcement by ID
const getAnnouncementById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM announcements WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching announcement:", err);
      return res
        .status(500)
        .json({ error: "Failed to retrieve announcement." });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Announcement not found." });
    }
    res.status(200).json(results[0]);
  });
};

// Update an existing announcement
const updateAnnouncement = (req, res) => {
  const { id } = req.params;
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required." });
  }

  const query = "UPDATE announcements SET title = ?, message = ? WHERE id = ?";
  db.query(query, [title, message, id], (err, result) => {
    if (err) {
      console.error("Error updating announcement:", err);
      return res.status(500).json({ error: "Failed to update announcement." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Announcement not found." });
    }
    res.status(200).json({ message: "Announcement updated successfully!" });
  });
};

// Delete an announcement
const deleteAnnouncement = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM announcements WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting announcement:", err);
      return res.status(500).json({ error: "Failed to delete announcement." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Announcement not found." });
    }
    res.status(200).json({ message: "Announcement deleted successfully!" });
  });
};

// function to add fine to student
const addFineToStudent = (req, res) => {
  const { school_id } = req.user; // School ID from the authenticated admin
  const { student_id } = req.params; // Student ID from URL parameter
  const { amount, reason } = req.body; // Fine amount and reason from request body

  // Validate input
  if (!student_id || !school_id || !amount || !reason) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Step 1: Check if the student belongs to the admin's school
  const checkStudentQuery =
    "SELECT school_id FROM students WHERE id = ? AND school_id = ?";
  db.query(checkStudentQuery, [student_id, school_id], (err, results) => {
    if (err) {
      console.error("Error checking student:", err);
      return res.status(500).json({ error: "Failed to verify student." });
    }

    if (results.length === 0) {
      // Student does not belong to the admin's school
      return res.status(403).json({
        error: "You are not authorized to add a fine to this student.",
      });
    }

    // Step 2: Add the fine to the database
    const addFineQuery =
      "INSERT INTO fines (school_id, student_id, amount, reason) VALUES (?, ?, ?, ?)";
    db.query(
      addFineQuery,
      [school_id, student_id, amount, reason],
      (err, result) => {
        if (err) {
          console.error("Error adding fine:", err);
          return res.status(500).json({ error: "Failed to add fine." });
        }

        res.status(201).json({
          message: "Fine added successfully!",
          fine_id: result.insertId,
        });
      }
    );
  });
};

// function to update fine of student
const updateFineForStudent = (req, res) => {
  const { id } = req.params; // student ID
  const { status } = req.body; // fine ID and updated data

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  const query = "UPDATE fines SET  status = ? WHERE student_id = ?";
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating fine:", err);
      return res.status(500).json({ error: "Failed to update fine." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Fine not found for this student." });
    }
    res.status(200).json({ message: "Fine updated successfully!" });
  });
};

// function to delete fine to student
const deleteFineForStudent = (req, res) => {
  const { id } = req.params; // student ID
  const { fine_id } = req.body; // fine ID to delete

  if (!fine_id) {
    return res.status(400).json({ error: "Fine ID is required." });
  }

  const query = "DELETE FROM fines WHERE id = ? AND student_id = ?";
  db.query(query, [fine_id, id], (err, result) => {
    if (err) {
      console.error("Error deleting fine:", err);
      return res.status(500).json({ error: "Failed to delete fine." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Fine not found for this student." });
    }
    res.status(200).json({ message: "Fine deleted successfully!" });
  });
};

// function to view student fine
const getStudentFines = (req, res) => {
  const { id } = req.params; // student ID

  const query =
    "SELECT * FROM fines WHERE student_id = ? ORDER BY fine_date DESC";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching fines:", err);
      return res.status(500).json({ error: "Failed to retrieve fines." });
    }
    res.status(200).json(results);
  });
};

const getFineDetail = (req, res) => {
  const { school_id } = req.user; // School ID from the authenticated admin

  // Modify the query to filter fines by the school_id
  const query = "SELECT * FROM fines WHERE school_id = ?";

  db.query(query, school_id, (error, result) => {
    if (error) {
      console.error("Error fetching fines:", error);
      return res.status(400).json({ error: "Failed to fetch fine details." });
    } else {
      return res.status(200).json({ fines: result });
    }
  });
};

//function to generate fine slip of student
const generateFineSlip = (req, res) => {
  const { id } = req.params; // student ID

  const query =
    'SELECT * FROM fines WHERE student_id = ? AND status = "unpaid"';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error generating fine slip:", err);
      return res.status(500).json({ error: "Failed to generate fine slip." });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No unpaid fines found for this student." });
    }

    // Assuming you want to generate a PDF or just send the fine details as a JSON response
    const fineSlip = {
      student_id: id,
      fines: results,
      total_fine: results.reduce((total, fine) => total + fine.amount, 0),
      generated_at: new Date(),
    };

    res.status(200).json(fineSlip);
  });
};

const getFeeDetail = (req, res) => {
  const query = "Select * from fee_payment_status";

  db.query(query, (error, result) => {
    if (error) {
      return res.status(400).json({ error: error });
    }
    return res.status(200).json({ feePayment: result });
  });
};

// Function to add or update the fee payment status for a student
const addFeePayment = (req, res) => {
  const { student_id, amount_paid, total_amount, payment_status, due_date } =
    req.body;

  // Validate input
  if (
    !student_id ||
    !amount_paid ||
    !total_amount ||
    !payment_status ||
    !due_date
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Ensure the payment status is one of the allowed values
  if (!["paid", "pending", "partially paid"].includes(payment_status)) {
    return res.status(400).json({ error: "Invalid payment status." });
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

      // Check if there's already a record for this student
      db.query(
        "SELECT * FROM fee_payment_status WHERE student_id = ?",
        [student_id],
        (err, existingRecords) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error occurred." });
          }

          if (existingRecords.length > 0) {
            // If record exists, update it
            const updateQuery = `
            UPDATE fee_payment_status
            SET amount_paid = ?, total_amount = ?, payment_status = ?, due_date = ?
            WHERE student_id = ?
          `;
            db.query(
              updateQuery,
              [amount_paid, total_amount, payment_status, due_date, student_id],
              (err, result) => {
                if (err) {
                  console.error(err);
                  return res
                    .status(500)
                    .json({ error: "Failed to update fee payment status." });
                }

                return res.status(200).json({
                  message: "Fee payment status updated successfully.",
                });
              }
            );
          } else {
            // If no record exists, insert a new one
            const insertQuery = `
            INSERT INTO fee_payment_status (student_id, amount_paid, total_amount, payment_status, due_date)
            VALUES (?, ?, ?, ?, ?)
          `;
            db.query(
              insertQuery,
              [student_id, amount_paid, total_amount, payment_status, due_date],
              (err, result) => {
                if (err) {
                  console.error(err);
                  return res
                    .status(500)
                    .json({ error: "Failed to add fee payment status." });
                }

                return res.status(201).json({
                  message: "Fee payment status added successfully.",
                });
              }
            );
          }
        }
      );
    }
  );
};

const assignClassToFaculty = (req, res) => {
  const { school_id } = req.user; // Extract from token
  const { teacher_id, class_name, subject, time, room_no } = req.body;

  // Validate the input fields
  if (
    !school_id ||
    !teacher_id ||
    !class_name ||
    !subject ||
    !time ||
    !room_no
  ) {
    return res.status(400).json({
      error:
        "All fields (school_id, teacher_id, class_name, subject, time, room_no) are required.",
    });
  }

  // Check if the teacher exists
  db.query(
    "SELECT * FROM faculty WHERE id = ?",
    [teacher_id],
    (err, results) => {
      if (err) {
        console.error("Error checking teacher existence:", err);
        return res.status(500).json({ error: "Database error occurred." });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Teacher not found." });
      }

      const checkTimeQuery = `SELECT * FROM class_assignments WHERE teacher_id = ? AND time = ?`;
      db.query(checkTimeQuery, [teacher_id, time], (err, results) => {
        if (err) {
          console.error("Error checking teacher schedule:", err);
          return res.status(500).json({ error: "Database error occurred." });
        }

        if (results.length > 0) {
          console.error(
            "Teacher with this id already has a class assigned at this time."
          );
          return res.status(400).json({
            error:
              "Teacher with this id already has a class assigned at this time.",
          });
        }

        // Insert the class assignment
        const query = `
      INSERT INTO class_assignments (school_id, teacher_id, class_name, subject, time, room_no)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        db.query(
          query,
          [school_id, teacher_id, class_name, subject, time, room_no],
          (err, result) => {
            if (err) {
              console.error("Error assigning class:", err);
              return res.status(500).json({ error: "Failed to assign class." });
            }

            res.status(201).json({ message: "Class assigned successfully!" });
          }
        );
      });
    }
  );
};

const getSubjects = (req, res) => {
  const facultyId = req.params.id;
  console.log("Received Faculty ID:", facultyId); // Debugging log
  if (!facultyId) {
    return res.status(400).json({ error: "Faculty ID is required" });
  }

  const query = "SELECT department FROM faculty WHERE id = ?";
  db.query(query, [facultyId], (error, results) => {
    if (error) {
      console.error("Database Error:", error); // Log error for debugging
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Faculty ID not found" });
    }

    const department = results[0].department; // Get the department
    console.log("Fetched Department:", department); // Debugging log
    return res.status(200).json({ department });
  });
};

const getAssignedClasses = (_, res) => {
  db.query("Select * from class_assignments", (error, result) => {
    if (error) {
      return res.status(500).json({ error: error });
    }
    return res.status(200).json({ AssignedClass: result });
  });
};

// Controller functions:
const getClasses = (req, res) => {
  const query = "SELECT DISTINCT class FROM students"; // Fetch all unique classes
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching classes:", err);
      return res.status(500).json({ error: "Failed to fetch classes." });
    }
    res.status(200).json({ classes: result });
  });
};

// Get students by class or student_id (optional)
const getStudents = async (req, res) => {
  const { class_name, student_id } = req.query; // Extract class_name and student_id from query params

  // Validate that the class_name is provided
  if (!class_name) {
    return res.status(400).json({ error: "Class name is required" });
  }

  // Construct the base SQL query
  let query = "SELECT id, username FROM students WHERE class = ?";
  const params = [class_name];

  // If student_id is provided, add it to the query for further filtering
  if (student_id) {
    query += " AND id = ?";
    params.push(student_id);
  }

  try {
    // Execute the query
    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch students from the database" });
      }

      // Return the results to the client
      res.status(200).json({ students: results });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const getSchoolId = (req, res) => {
  const adminId = req.user.id;

  const query = "SELECT school_id FROM admin WHERE id = ?";

  db.query(query, [adminId], (error, result) => {
    if (error) {
      console.error("Database Error:", error);
      return res.status(500).json({ error: "Failed to fetch school id" });
    } else if (result.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Correctly send the response as a JSON object
    res.status(200).json({ schoolId: result[0].school_id });
  });
};

// Export controller functions
module.exports = {
  login,

  createFaculty,
  getFaculty,
  editFaculty,
  deleteFaculty,
  assignClassToFaculty,
  getAssignedClasses,
  getSubjects,

  createStudent,
  getStudent,
  editStudent,
  deleteStudent,

  createParent,
  getParents,
  editParent,
  deleteParent,

  getApproveLeave,
  updateLeaveStatus,

  createFeeStructure,
  updateFeeStructure,
  getAllFeeStructures,
  getFeeStructure,
  deleteFeeStructure,

  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,

  addFineToStudent,
  getFineDetail,
  updateFineForStudent,
  deleteFineForStudent,
  generateFineSlip,

  addFeePayment,
  getFeeDetail,
  getStudentFines,

  getStudents,
  getClasses,
  getStudents,

  getSchoolId,
};
