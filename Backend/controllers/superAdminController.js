const bcrypt = require('bcrypt');
const db = require('../config/db');

// Controller function to register a new super admin
const registerSuperAdmin = (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if username already exists
  db.query(
    'SELECT * FROM super_admin WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash the password before saving it to the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Insert the new super admin into the database
        db.query(
          'INSERT INTO super_admin (username, password) VALUES (?, ?)',
          [username, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
              message: 'Super admin registered successfully',
              superAdmin: {
                id: result.insertId,
                username: username
              }
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
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Query to check if the super admin exists with the provided username
  db.query(
    'SELECT * FROM super_admin WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare the password with the hashed password in the database
      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If passwords match, return super admin details
        res.status(200).json({
          message: 'Login successful',
          superAdmin: results[0],  // Send back the super admin details
        });
      });
    }
  );
};

// Controller function to create a new admin
const createAdmin = (req, res) => {
  const { username, password, full_name, email } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the email is provided
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Check if the username already exists
  db.query('SELECT * FROM admin WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if the email already exists
    db.query('SELECT * FROM admin WHERE email = ?', [email], (err, emailResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (emailResults.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash the password before saving it to the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Insert the new admin into the database, including full_name and email
        const query = `
          INSERT INTO admin (username, password, full_name, email)
          VALUES (?, ?, ?, ?)
        `;
        
        db.query(query, [username, hashedPassword, full_name, email], (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.status(201).json({
            message: 'Admin created successfully',
            admin: {
              id: result.insertId,
              username,
              full_name,
              email
            }
          });
        });
      });
    });
  });
};

// Controller function to fetch all admins
const getAllAdmins = (req, res) => {
  db.query('SELECT * FROM admin', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ admins: results });
  });
};

// Controller function to update an admin
const updateAdmin = (req, res) => {
  const { id, username, password, full_name, email } = req.body;

  // Check if all required fields are provided
  if (!id || !username || !full_name || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Optionally, hash the new password if provided
  let updateQuery = 'UPDATE admin SET username = ?, full_name = ?, email = ?';
  let values = [username, full_name, email];

  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      updateQuery += ', password = ?';
      values.push(hashedPassword);

      db.query(updateQuery + ' WHERE id = ?', [...values, id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(200).json({ message: 'Admin updated successfully' });
      });
    });
  } else {
    db.query(updateQuery + ' WHERE id = ?', [...values, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json({ message: 'Admin updated successfully' });
    });
  }
};

// Controller function to delete an admin
const deleteAdmin = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM admin WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  });
};
 
module.exports = {
  registerSuperAdmin,
  loggedIn,
  createAdmin,
  getAllAdmins, 
  updateAdmin,
  deleteAdmin
};
