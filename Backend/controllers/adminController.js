const bcrypt = require("bcrypt");
const db = require("../config/db");
const { query } = require("express");

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
    username,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Direct password comparison (REMOVE bcrypt)
      if (results[0].password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.status(200).json({
        message: "Login successful",
      });
    }
  );
};

// Function to create a faculty account
const createFaculty = (req, res) => {
  const { username, password, full_name, email, phone, department } = req.body;

  // Check if all required fields are provided
  if (!username || !password || !full_name || !email || !phone || !department) {
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
          INSERT INTO faculty (username, password, full_name, email, phone, department, created_at)
          VALUES (?, ?, ?, ?, ?, ?, NOW())`;

            db.query(
              query,
              [username, hashedPassword, full_name, email, phone, department],
              (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                // Return a success message with the faculty's details
                res.status(201).json({
                  message: "Faculty account created successfully",
                  faculty: {
                    id: result.insertId,
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
    // Use query instead of execute
    db.query("SELECT * FROM faculty", (err, results) => {
      if (err) {
        console.error("Error fetching faculty:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching faculty" });
      }
      res.status(200).json({ success: true, data: results });
    });
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
          INSERT INTO students (username, password, full_name, email, phone, class)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
          query,
          [username, hashedPassword, full_name, email, phone, studentClass],
          (err, result) => {
            if (err) return res.status(500).json({ error: "Insertion error" });

            res.status(201).json({
              message: "Student account created successfully",
              student: {
                id: result.insertId,
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
  // const query = `Select * from students`;

  const query =
    "SELECT id, username, password, full_name, email, phone, class AS studentClass FROM students";

  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({ error: error });
    }
    return res.status(200).json({ student: result });
  });
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
  console.log("Request Body:", req.body); // Add this to inspect the incoming data

  const { username, password, full_name, email, phone, student_id } = req.body;

  if (!username || !password || !full_name || !email || !phone || !student_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
          INSERT INTO parents (username, password, full_name, email, phone, student_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

  db.query(
    query,
    [username, password, full_name, email, phone, student_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Parent account created successfully",
        result,
      });
    }
  );
};

const getParents = (_, res) => {
  const query = `Select * from parents`;

  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res
      .status(200)
      .json({ message: "Parent data fetched successfully", parents: result });
  });
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

// Create a new announcement
const createAnnouncement = (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required." });
  }

  const query = "INSERT INTO announcements (title, message) VALUES (?, ?)";
  db.query(query, [title, message], (err, result) => {
    if (err) {
      console.error("Error creating announcement:", err);
      return res.status(500).json({ error: "Failed to create announcement." });
    }
    res.status(201).json({
      message: "Announcement created successfully!",
      id: result.insertId,
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
  const { id } = req.params; // student ID from URL parameter
  const { amount, reason } = req.body; // Fine amount and reason from request body

  if (!amount || !reason) {
    return res.status(400).json({ error: "Amount and reason are required." });
  }

  const query =
    "INSERT INTO fines (student_id, amount, reason) VALUES (?, ?, ?)";
  db.query(query, [id, amount, reason], (err, result) => {
    if (err) {
      console.error("Error adding fine:", err);
      return res.status(500).json({ error: "Failed to add fine." });
    }
    res
      .status(201)
      .json({ message: "Fine added successfully!", fine_id: result.insertId });
  });
};

// function to update fine of student
const updateFineForStudent = (req, res) => {
  const { id } = req.params; // student ID
  const { fine_id, amount, reason, status } = req.body; // fine ID and updated data

  if (!fine_id || !amount || !reason || !status) {
    return res
      .status(400)
      .json({ error: "Fine ID, amount, reason, and status are required." });
  }

  const query =
    "UPDATE fines SET amount = ?, reason = ?, status = ? WHERE id = ? AND student_id = ?";
  db.query(query, [amount, reason, status, fine_id, id], (err, result) => {
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
  const query = "Select * from fines";

  db.query(query, (error, result) => {
    if (error) {
      return res.status(400).json({ error: error });
    } else {
      return res.status(200).json({ fine: result });
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

// function to assign classes to faculty
const assignClassToFaculty = (req, res) => {
  const { teacher_id, class_name, subject, time, room_no, year } = req.body;

  // Validate the input fields
  if (!teacher_id || !class_name || !subject || !time || !room_no || !year) {
    return res.status(400).json({
      error:
        "Teacher ID, class name, subject, time, room number, and year are required.",
    });
  }

  // Check if the teacher exists in the database
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

      // Insert the class assignment into the database
      const query = `
      INSERT INTO class_assignments (teacher_id, class_name, subject, time, room_no, year)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

      db.query(
        query,
        [teacher_id, class_name, subject, time, room_no, year],
        (err, result) => {
          if (err) {
            console.error("Error assigning class:", err);
            return res.status(500).json({ error: "Failed to assign class." });
          }

          res.status(201).json({ message: "Class assigned successfully!" });
        }
      );
    }
  );
};

const getAssignedClasses = (_, res) => {
  db.query("Select * from class_assignments", (error, result) => {
    if (error) {
      return res.status(500).json({ error: error });
    }
    return res.status(200).json({ AssignedClass: result });
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
};
