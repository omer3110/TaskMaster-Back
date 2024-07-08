const jwt = require("jsonwebtoken");
const Task = require("../models/task.model");

const { JWT_SECRET } = process.env;

function verifyToken(req, res, next) {
  // Split the token from the header (Bearer token)
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"]; // Get the authorization header
  const token = authHeader && authHeader.split(" ")[1]; // Get the token from the header
  if (!token) {
    console.log("auth.middleware, verifyToken. No token provided");
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.userId = decoded.userId; // Add userId to request object
    next(); // Call next middleware
  } catch (error) {
    console.log(
      "auth.middleware, verifyToken. Error while verifying token",
      error
    );
    res.status(401).json({ error: "Invalid token" });
  }
}

const authorizeTaskOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    }

    if (task.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to access this task" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { verifyToken, authorizeTaskOwner };
