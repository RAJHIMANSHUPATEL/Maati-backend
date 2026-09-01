const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { CRM_STAFF, staffRole } = require("../../middlewares/adminAuth.middleware");

const STAFF_TYPES = ["owner", "manager", "cashier"];
const STAFF_QUERY = { type: { $in: ["owner", "admin", "manager", "cashier"] } };

const displayName = (user) =>
  `${user.first_name || ""} ${user.last_name || ""}`.trim();

const staffPayload = (user) => ({
  _id: user._id,
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  name: displayName(user),
  type: staffRole(user),
  stores: user.stores || [],
});

const normalizeStaffType = (type) => {
  if (type === "admin") return "owner";
  return type;
};

const validateStaffFields = (detail, type) => {
  if (!STAFF_TYPES.includes(type)) {
    return "Role must be owner, manager, or cashier";
  }
  if (type === "manager" || type === "cashier") {
    if (!/^\d{4}$/.test(String(detail.staff_code || ""))) {
      return "Operator number must be 4 digits";
    }
    if (!/^\d{4}$/.test(String(detail.staff_pin || ""))) {
      return "Staff PIN must be 4 digits";
    }
    if (!Array.isArray(detail.stores) || detail.stores.length === 0) {
      return "Assign at least one store";
    }
  }
  return null;
};

const registerUser = async (req, res) => {
  try {
    const userDetail = req.body;
    const type = normalizeStaffType(userDetail.type);
    const fieldError = validateStaffFields(userDetail, type);
    if (fieldError) {
      return res.status(400).send({ success: false, message: fieldError });
    }

    const existingUser = await User.findOne({
      $or: [{ email: userDetail.email }, { mobile: userDetail.mobile }],
    });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exist with this email or phone number",
      });
    }

    if (userDetail.staff_code) {
      const codeTaken = await User.findOne({ staff_code: userDetail.staff_code });
      if (codeTaken) {
        return res.status(400).send({
          success: false,
          message: "Operator number is already in use",
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDetail.password, salt);

    const newUser = await User.create({
      ...userDetail,
      type,
      stores: type === "owner" ? userDetail.stores || [] : userDetail.stores,
      password: hashedPassword,
    });
    res
      .status(201)
      .send({ success: true, message: "User registered successfully", data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let fetchedUser = await User.findOne({ email });

    if (
      !fetchedUser ||
      !CRM_STAFF.has(fetchedUser.type) ||
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
      success: true,
      authToken,
      data: staffPayload(fetchedUser),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const getUser = async (req, res, type) => {
  try {
    const { _id } = req.query;
    const typeFilter = type === "staff" ? STAFF_QUERY : { type };
    if (!_id) {
      const fetchedUsers = await User.find(typeFilter)
        .sort({ _id: -1 })
        .select("-password")
        .populate("stores", "_id name");
      return res.status(200).json({ success: true, data: fetchedUsers });
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id format" });
    }

    const fetchedUser = await User.findOne({ _id, ...typeFilter })
      .select("-password")
      .populate("stores", "_id name");
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

const updateUser = async (req, res) => {
  const { _id, ...data } = req.body;

  if (data.password) {
    delete data.password;
  }

  if (data.type) {
    data.type = normalizeStaffType(data.type);
    const fieldError = validateStaffFields({ ...data }, data.type);
    if (fieldError) {
      return res.status(400).send({ success: false, message: fieldError });
    }
  }

  const existingUser = await User.findOne({
    $or: [{ email: data.email }, { mobile: data.mobile }],
    _id: { $ne: _id },
  });

  if (existingUser) {
    return res.status(400).send({
      success: false,
      message: "User is already exist with this email or mobile",
    });
  }

  if (data.staff_code) {
    const codeTaken = await User.findOne({
      staff_code: data.staff_code,
      _id: { $ne: _id },
    });
    if (codeTaken) {
      return res.status(400).send({
        success: false,
        message: "Operator number is already in use",
      });
    }
  }

  try {
    const updatedConfig = await User.findOneAndUpdate(
      { _id },
      { $set: data },
      { new: true, runValidators: true }
    ).populate("stores", "_id name");

    if (!updatedConfig) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedConfig,
    });
  } catch (error) {
    console.error("Update failed:", error);
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
    const filter = type === "staff" ? STAFF_QUERY : { type };
    const total = await User.countDocuments(filter);
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
