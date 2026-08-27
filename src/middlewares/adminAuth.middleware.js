const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const User = require("../models/user.model");
dotenv.config()

/**
 * Middleware to check if the user is an admin.
 * It verifies the JWT token from the request header and checks if the user type is 'admin'.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const checkAdmin = async (req, res, next) => {
  // Get the token from the 'AuthToken' header
  const token = req.header('AuthToken');
  if (!token) {
    return res.status(401).send({ success: false, message: "Access Denied! Token is required" });
  }

  try {
    // Verify the token using the JWT secret
    const data = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID from the token
    const user = await User.findOne({ _id: data.user.id });

    // Check if the user exists and has the 'admin' type
    if (user && user.type === "admin") {
      req.admin = user;
      next();
    } else {
      // If the user is not an admin, send an access denied error
      res.status(401).send({ success: false, message: "Access Denied! Invalid token" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).send({ success: false, message: `Internal server error: ${error.message}` });
  }
};

module.exports = checkAdmin;
