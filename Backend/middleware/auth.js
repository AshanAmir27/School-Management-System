const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No token provided or invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure your secret matches the token creation
    req.user = decoded; // Attach user info from token to request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
