const OTP = require("../../models/otp.model");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const { transporter, fromAddress } = require("../../utils/mailer");

//Six digit otp
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Controller to send OTP for password reset.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const sendOtp = async (req, res) => {
  const { email, purpose } = req.body;
  const isReset = purpose === "reset";

  try {
    const existing = await User.findOne({ email });
    if (isReset) {
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "No account found with this email" });
      }
    } else if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Store otp (Replace if exists)
    const result = await OTP.findOneAndUpdate(
      { email },
      { otpHash: hashedOtp, attempts: 0, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const mailOptions = {
      from: fromAddress(),
      to: email,
      subject: "Your One-Time Password (OTP) for Password Reset",
      text: `
      Dear User,

      We received a request to reset your account password. Please use the One-Time Password (OTP) below to proceed:

      Your OTP: ${otp}.

      This OTP is valid for the next 3 minutes.
      Do not share this code with anyone. If you did not request a password reset, please ignore this email or contact our support team immediately.

      Thank you,
      Maati
      Support Team
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "otp sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Controller to verify OTP.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const verifyOtp = async (req, res) => {
  const { email, otp: userOtp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not found or expired" });
    }

    // Check if OTP is expired (3 minutes)
    const isExpired =
      new Date() - new Date(otpRecord.createdAt) > 3 * 60 * 1000;
    if (isExpired) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Check max attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ email });
      return res.status(403).json({
        success: false,
        message: "Maximum attempts exceeded. Request for NEW.",
      });
    }

    const isMatch = await bcrypt.compare(userOtp, otpRecord.otpHash);

    if (!isMatch) {
      await OTP.updateOne({ email }, { $inc: { attempts: 1 } });
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is correct - cleanup and proceed
    // await OTP.deleteOne({ email });

    // Proceed to create/verify user (depends on your flow)
    // Example: Mark user as verified
    await User.updateOne({ email }, { $set: { isVerified: true } });

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { sendOtp, verifyOtp };
