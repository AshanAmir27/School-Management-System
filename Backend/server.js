const express = require("express");
const cors = require("cors");
const superAdminRoutes = require("./routes/SuperAdmin");
const adminRoutes = require("./routes/Admin");
const facultyRoutes = require("./routes/facultyRoutes");
const studentRoutes = require("./routes/studentRoutes");
const parentRoutes = require("./routes/parentRoutes");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 5000;

// Middleware to allow CORS
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Use routes
app.use("/api/superAdmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/parent", parentRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
