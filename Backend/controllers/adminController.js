const bcrypt = require('bcrypt');
const db = require('../config/db');

// Controller function to authenticate admin login
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.query('SELECT * FROM admin WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.status(200).json({
        message: 'Login successful',
        admin: results[0], // Return admin details
      });
    });
  });
};

// Function to create a faculty account
const createFaculty = (req, res) => {
  const { username, password, full_name, email, phone } = req.body;

  if (!username || !password || !email || !full_name || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query('SELECT * FROM faculty WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    db.query('SELECT * FROM faculty WHERE email = ?', [email], (err, emailResults) => {
      if (err) return res.status(500).json({ error: err.message });

      if (emailResults.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err.message });

        const query = `
          INSERT INTO faculty (username, password, full_name, email, phone)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(query, [username, hashedPassword, full_name, email, phone], (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          res.status(201).json({
            message: 'Faculty account created successfully',
            faculty: { id: result.insertId, username, full_name, email, phone },
          });
        });
      });
    });
  });
};

// Function to edit a student account
const editFaculty = (req, res) => {
    const { id } = req.params;
    const { full_name, email, phone} = req.body;
  
    if (!id) {
      return res.status(400).json({ error: 'Faculty ID is required' });
    }
  
    db.query(
      'UPDATE faculty SET full_name = ?, email = ?, phone = ? WHERE id = ?',
      [full_name, email, phone,  id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Faculty not found' });
        }
  
        res.status(200).json({ message: 'Faculty updated successfully' });
      }
    );
  };

  // Function to delete a faculty account
const deleteFaculty = (req, res) => {
    const { id } = req.params;
  
    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({ error: 'Faculty ID is required' });
    }
  
    // Delete query for the faculty table
    db.query('DELETE FROM faculty WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
  
      res.status(200).json({ message: 'Faculty deleted successfully' });
    });
  };
  
// Function to create a student account
const createStudent = (req, res) => {
  const { username, password, full_name, email, phone, class: studentClass } = req.body;

  if (!username || !password || !full_name || !email || !studentClass) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query('SELECT * FROM students WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: err.message });

      const query = `
        INSERT INTO students (username, password, full_name, email, phone, class)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(query, [username, hashedPassword, full_name, email, phone, studentClass], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
          message: 'Student account created successfully',
          student: { id: result.insertId, username, full_name, email, class: studentClass },
        });
      });
    });
  });
};

// Function to edit a student account
const editStudent = (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, class: studentClass } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  db.query(
    'UPDATE students SET full_name = ?, email = ?, phone = ?, class = ? WHERE id = ?',
    [full_name, email, phone, studentClass, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.status(200).json({ message: 'Student updated successfully' });
    }
  );
};

// Function to delete a student account
const deleteStudent = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  db.query('DELETE FROM students WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  });
};

const createParent = (req, res) => {
    const { username, password, full_name, email, phone, student_id } = req.body;
  
    // Validate required fields
    if (!username || !password || !full_name || !email || !student_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    // Check if the username already exists
    db.query('SELECT * FROM parents WHERE username = ?', [username], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (results.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err.message });
  
        // Insert the new parent into the database
        const query = `
          INSERT INTO parents (username, password, full_name, email, phone, student_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
  
        db.query(query, [username, hashedPassword, full_name, email, phone, student_id], (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
  
          res.status(201).json({
            message: 'Parent account created successfully',
            parent: {
              id: result.insertId,
              username,
              full_name,
              email,
              phone,
              student_id
            }
          });
        });
      });
    });
  };
  
  const editParent = (req, res) => {
    const { id } = req.params;
    const { full_name, email, phone, student_id } = req.body;
  
    // Validate required fields
    if (!id) {
      return res.status(400).json({ error: 'Parent ID is required' });
    }
  
    db.query(
      'UPDATE parents SET full_name = ?, email = ?, phone = ?, student_id = ? WHERE id = ?',
      [full_name, email, phone, student_id, id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Parent not found' });
        }
  
        res.status(200).json({ message: 'Parent updated successfully' });
      }
    );
  };
  
  const deleteParent = (req, res) => {
    const { id } = req.params;
  
    // Validate required fields
    if (!id) {
      return res.status(400).json({ error: 'Parent ID is required' });
    }
  
    db.query('DELETE FROM parents WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Parent not found' });
      }
  
      res.status(200).json({ message: 'Parent deleted successfully' });
    });
  };


  const getAllFaculty = (req, res) => {
    db.query('SELECT * FROM faculty', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      res.status(200).json({
        message: 'Faculty accounts retrieved successfully',
        faculty: results,
      });
    });
  };
  
  const getAllStudents = (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      res.status(200).json({
        message: 'Student accounts retrieved successfully',
        students: results,
      });
    });
  };

  const getAllParents = (req, res) => {
    db.query('SELECT * FROM parents', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      res.status(200).json({
        message: 'Parent accounts retrieved successfully',
        parents: results,
      });
    });
  };
  
  

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
  getAllFaculty,
  getAllStudents,
  getAllParents
};
