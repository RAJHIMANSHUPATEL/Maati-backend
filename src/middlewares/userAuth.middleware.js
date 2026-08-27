const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user.model");
dotenv.config();

/**
 * Middleware to check if the user is authenticated.
 * It verifies the JWT token from the request header and checks if the user exists.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const checkUser = async (req, res, next) => {
  // Get the token from the 'AuthToken' header
  const token = req.header("AuthToken");

  if (!token) {
    return res
      .status(401)
      .send({ success: false, message: "Access Denied! Token is required" });
  }

  try {
    // Verify the token using the JWT secret
    const data = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user by the ID from the token
    const user = await User.findOne({ _id: data.userId });

    // Check if the user exists
    if (user) {
      req.user = user; // Attach user to the request
      // If the user exists, proceed to the next middleware
      next();
    } else {
      // If the user does not exist, send an access denied error
      res
        .status(401)
        .send({ success: false, message: "Access Denied! Invalid token" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = checkUser;
