const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

/**
 * Controller to register a new user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const registerUser = async (req, res) => {
  try {
    const userDetail = req.body;
    const existingUser = await User.findOne({
      $or: [{ email: userDetail.email }, { mobile: userDetail.mobile }],
    });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exist with this email or phone number",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDetail.password, salt);

    const newUser = await User.create({
      ...userDetail,
      type: "admin",
      password: hashedPassword,
    });
    res
      .status(201)
      .send({ success: true, message: "User registered successfully", data: newUser });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

/**
 * Controller to log in a user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let fetchedUser = await User.findOne({ email });

    if (
      !fetchedUser ||
      fetchedUser.type !== "admin" ||
      fetchedUser.status !== "active"
    ) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid credentials" });
    }

    const passComp = await bcrypt.compare(password, fetchedUser.password);
    if (!passComp) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid credentials" });
    }

    const tokenPayload = {
      user: {
        id: fetchedUser._id,
        email: fetchedUser.email,
        type: fetchedUser.type,
      },
    };

    const authToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.send({
      success: true, authToken, data: {
        _id: fetchedUser._id,
        email: fetchedUser.email,
        name: fetchedUser.name,
        type: fetchedUser.type,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

/**
 * Controller to get all users or a single user by ID.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {string} type - The type of user to fetch (e.g., "user", "admin").
 */
const getUser = async (req, res, type) => {
  try {
    const {_id} = req.query;
    if (!_id) {
      // Fetch users of the given type and exclude the password field
      const fetchedUsers = await User.find({ type: type })
        .sort({ _id: -1 })
        .select("-password");
      return res.status(200).json({ success: true, data: fetchedUsers });
    }

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id format" });
    }

    // Fetch a single user of the given type and exclude the password field
    const fetchedUser = await User.findOne({ _id }).select("-password");
    if (!fetchedUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: fetchedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Controller to update a user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateUser = async (req, res) => {
  const { _id, ...data } = req.body;

  // Delete password from the update data if exists
  if (data.password) {
    delete data.password;
  }

  const existingUser = await User.findOne({
    $or: [{ email: data.email }, { mobile: data.mobile }],
    _id: { $ne: _id }, // Exclude the current user with the provided _id
  });

  if (existingUser) {
    return res.status(400).send({
      success: false,
      message: "User is already exist with this email or mobile",
    });
  }

  try {
    // Find and update the user record
    const updatedConfig = await User.findOneAndUpdate(
      { _id },
      { $set: data },
      { new: true, runValidators: true } // Ensures validators are executed on update
    );

    // If no matching record is found
    if (!updatedConfig) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Successfully updated record
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedConfig, // Return the updated record for confirmation
    });
  } catch (error) {
    console.error("Update failed:", error); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the user",
    });
  }
};


const updateUserStatus = async (req, res) => {
  const { _id, status } = req.body;
  try {
    const updated = await User.findOneAndUpdate(
      { _id },
      { $set: { status } },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserCount = async (req, res) => {
  try {
    const type = req.query.type || "user";
    const total = await User.countDocuments({ type });
    return res.status(200).json({ success: true, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  updateUserStatus,
  getUserCount,
};
