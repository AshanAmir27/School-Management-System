const bcrypt = require("bcrypt");
const db = require("../config/db");

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

// Controller function to authenticate the super admin login
const loggedIn = (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Query to check if the super admin exists with the provided username
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

        // If passwords match, return super admin details
        res.status(200).json({
          message: "Login successful",
          superAdmin: results[0], // Send back the super admin details
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

  // Check if username and password are provided
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Fields are required" });
  }

  const query = `
  INSERT INTO admin (username, password, full_name, email, school_id)
  VALUES (?, ?, ?, ?, ?)
  `;

  const user = [username, password, full_name, email, school_id];

  db.query(query, user, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: "Admin created successfully",
      result,
    });
  });
  // );
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
