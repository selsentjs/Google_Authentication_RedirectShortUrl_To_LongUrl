const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies

  if (!token) {
    return res.status(403).json({ msg: "No token provided, access denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
