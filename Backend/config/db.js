const mysql = require("mysql2");

// Create a connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "school_management_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log("Database connected successfully");
  connection.release(); // Release the connection back to the pool
});

// Export the connection pool for use in other modules
module.exports = db;
