const bcrypt = require("bcrypt");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt");

// Controller function to register a new super admin
const registerSuperAdmin = (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Check if username already exists
  db.query(
    "SELECT * FROM super_admin WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash the password before saving it to the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Insert the new super admin into the database
        db.query(
          "INSERT INTO super_admin (username, password) VALUES (?, ?)",
          [username, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
              message: "Super admin registered successfully",
              superAdmin: {
                id: result.insertId,
                username: username,
              },
            });
          }
        );
      });
    }
  );
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
  const query = "SELECT * FROM super_admin WHERE username = ?";

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

// Controller function to authenticate the super admin login
const loggedIn = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  db.query(
    "SELECT * FROM super_admin WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Compare the password with the hashed password in the database
      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token with user details
        const token = jwt.sign(
          {
            id: results[0].id,
            username: results[0].username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        // Return success response with token
        res.status(200).json({
          message: "Login successful",
          token,
        });
      });
    }
  );
};

const addSchool = (req, res) => {
  const { name, contact_number, address, email, established_year } = req.body;

  if (!name || !contact_number || !address || !email || !established_year) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query = `
  INSERT INTO schools (name,address, contact_number, email, established_year)
  VALUES (?, ?,?, ?, ?)
`;
  db.query(
    query,
    [name, address, contact_number, email, established_year],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "School not added" });
      } else {
        return res.status(200).json({ message: "School added successfully" });
      }
    }
  );
};

// Controller function to create a new admin
const createAdmin = (req, res) => {
  const { username, password, full_name, email, school_id } = req.body;

  // Check if username, password, and email are provided
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Fields are required" });
  }

  // Hash the password before saving it in the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const query = `
      INSERT INTO admin (username, password, full_name, email, school_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    const user = [username, hashedPassword, full_name, email, school_id];

    db.query(query, user, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Admin created successfully",
        result,
      });
    });
  });
};

// Controller function to fetch all admins
const getAllAdmins = (req, res) => {
  db.query("SELECT * FROM admin", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ admins: results });
  });
};

// Controller function to update an admin
const updateAdmin = (req, res) => {
  const { id } = req.params;
  const { username, password, full_name, email, school_id } = req.body;

  // Validate required fields
  if (!username || !password || !full_name || !email || !school_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    UPDATE admin 
    SET username = ?, password = ?, full_name = ?, email = ?, school_id = ?
    WHERE id = ?
  `;

  const values = [username, password, full_name, email, school_id, id];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ message: "Admin updated successfully" });
  });
};

// Controller function to delete an admin
const deleteAdmin = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM admin WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  });
};

const getSchool = (req, res) => {
  db.query("Select * from schools", (error, result) => {
    if (error) {
      console.log("Error fetching school", error);
    }
    res.status(200).json({ schools: result });
  });
};

const updateSchool = (req, res) => {
  const { id } = req.params;
  const { name, address, contact_number, email, established_year } = req.body;

  // Validate required fields
  if (!name || !address || !contact_number || !email || !established_year) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Define the values array to use in the query
  const values = [name, address, contact_number, email, established_year, id];

  const query = `
 UPDATE schools
SET name = ?, address = ?, contact_number = ?, email = ?, established_year = ?
WHERE id = ?
`;

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ message: "Admin updated successfully" });
  });
};
// Inside your superAdminController.js
const deleteSchool = (req, res) => {
  const { id } = req.params;

  // Ensure the school exists in the database
  const queryCheck = "SELECT * FROM schools WHERE id = ?";
  db.query(queryCheck, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    // Proceed with deletion
    const queryDelete = "DELETE FROM schools WHERE id = ?";
    db.query(queryDelete, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Successfully deleted
      res.status(200).json({ message: "School deleted successfully" });
    });
  });
};

module.exports = {
  registerSuperAdmin,
  resetPassword,
  loggedIn,
  addSchool,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getSchool,
  updateSchool,
  deleteSchool,
};
