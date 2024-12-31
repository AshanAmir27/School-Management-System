const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("Auth Header in verifyToken:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No token provided or invalid token format" });
  }

  const token = authHeader.split(" ")[1];
  // console.log("Auth token", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure your secret matches the token creation

    // console.log("Decoded Token in verifyToken:", decoded); // Updated label

    req.user = decoded; // Attach user info from token to request
    next();
  } catch (err) {
    console.error("Token validation error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
