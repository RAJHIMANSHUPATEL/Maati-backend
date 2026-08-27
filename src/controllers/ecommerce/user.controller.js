const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const OTP = require("../../models/otp.model");
const { transporter, fromAddress } = require("../../utils/mailer");

/**
 * Controller to register a new user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const register = async (req, res) => {
  const userDetail = req.body;
  try {
    let existingUser = await User.findOne({
      $or: [
        { email: userDetail.email },
        { mobile: userDetail.mobile, country_code: userDetail.country_code },
      ],
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
      ...req.body,
      password: hashedPassword,
      type: "user",
    });
    res
      .status(201)
      .send({ success: true, message: "User registred successfully" });
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
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Email or Password" });
    }
    if (user.status !== "active") {
      return res.status(400).send({ success: false, message: "Invalid User" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: "Incorrect password" });
    }

    // const data = {
    //   user: {
    //     data: fetchedUser._id,
    //   },
    // };

    const authToken = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );
    res.status(200).send({
      success: true,
      authToken,
      message: "Login Successfully",
      data: user.toJSON(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

/**
 * Controller to verify a token.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const verify_token = async (req, res) => {
  const token = req.headers.authtoken;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    try {
      // Wait for the user to be fetched from the database
      const user = await User.findOne({ _id: decoded.userId });

      // Check if user was found
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).send({
        message: "Token is valid!",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  });
};

/**
 * Controller to get user by ID.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getuserbyid = async (req, res) => {
  try {
    const { _id } = req.body;

    const getbyid = await User.findOne({ _id: _id });

    res
      .status(201)
      .send({ success: true, message: "User get by Id", data: getbyid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Controller to get user by authenticated ID.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getuserbyauthid = async (req, res) => {
  try {
    const { _id } = req.body;

    const getbyid = await User.findOne({ _id: _id });

    res
      .status(201)
      .send({ success: true, message: "User get by Id", data: getbyid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Controller to update user details.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateUser = async (req, res) => {
  const data = req.body;
  const _id = req.user._id;

  if(data?.password) delete data.password;

  const existingUser = await User.findOne({
    $or: [
      { email: data.email },
      { mobile: data.mobile, country_code: data.country_code },
    ],
    _id: { $ne: _id }, // Exclude the current user with the provided _id
  });

  if (existingUser) {
    return res.status(400).send({
      success: false,
      message: "A user is already exist with this email or mobile",
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

/**
 * Controller to update user address.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateUserAddress = async (req, res) => {
  const { address } = req.body; // Get the new address and user ID from the request body
  const _id = req.user._id;
console.log("updateUserAddress req.body:", req.body);

  try {
    // Find the user by ID and check if an address with the same `id` exists
    const userDoc = await User.findById(_id);
    if (!userDoc) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existingAddressIndex = userDoc.address.findIndex(
      (addr) => addr._id == address._id
    );

    if (existingAddressIndex !== -1) {
      // Update the existing address
      userDoc.address[existingAddressIndex] = {
        ...userDoc.address[existingAddressIndex],
        ...address,
      };
    } else {
      // Add a new address to the array
      userDoc.address.push(address);
    }

    // Save the updated user document
    const updatedUser = await userDoc.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Controller to delete user address.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const deleteUserAddress = async (req, res) => {
  const { addressId } = req.body; // Get the user ID and address ID from the request body
  const _id = req.user._id;

  try {
    // Use the `$pull` operator to remove the address with the matching `id`
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $pull: { address: { _id: addressId } } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Controller to reset password.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const resetPassword = async (req, res) => {
  const { email, Otp, newPassword } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Check attempt limit
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ email }); // Delete OTP after max attempts
      return res.status(400).json({
        success: false,
        message: "Max OTP attempts reached. Request a new OTP.",
      });
    }

    // Compare OTP with hashed value
    const isOtpValid = await bcrypt.compare(Otp, otpRecord.otpHash);

    if (!isOtpValid) {
      await OTP.findOneAndUpdate({ email }, { $inc: { attempts: 1 } });
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update User Password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Delete OTP after successful verification
    await OTP.deleteOne({ email });

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Controller to send email.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const sendEmail = async (req, res) => {
  const data = req.body;

  if (!data.to || !data.html) {
    return res.status(400).send({
      success: false,
      message: "Missing recipient email or HTML content.",
    });
  }

  try {
    await transporter.sendMail({
      from: fromAddress(),
      to: data.to, // list of receivers
      bcc: data.cc ? data.cc.join(",") : undefined,
      subject: "Welcome to Maati",
      text: "Thank you for choosing Maati.",
      html: data.html, // html body
    });
    res.send({
      success: true,
      message: "Success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

/**
 * Controller to update user password.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const _id = req.user._id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect old password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(_id, { password: hashedPassword });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  updatePassword,
  register,
  loginUser,
  getuserbyid,
  updateUser,
  updateUserAddress,
  deleteUserAddress,
  verify_token,
  getuserbyauthid,
  sendEmail,
  resetPassword,
};
