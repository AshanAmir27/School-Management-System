// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware to check if the user is a Superadmin
const checkSuperAdminRole = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Access denied, not a Superadmin" });
  }
  next(); // Proceed to the next middleware or route handler if the user is a Superadmin
};

module.exports = {
  verifyToken,
  checkSuperAdminRole,
};
