// backend/db.js
const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',    
  user: 'root',         
  password: '',         
  database: 'school_management_system', 
});

db.connect((err) => {
  if (err) {
    console.error('error connecting to the database: ', err);
    return;
  }
  console.log('connected to the school_management_system database');
});

module.exports = db;
