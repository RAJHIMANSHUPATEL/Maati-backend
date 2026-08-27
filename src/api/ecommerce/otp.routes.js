const express = require("express");
const {
  sendOtp,
  verifyOtp,
} = require("../../controllers/ecommerce/otp.controller");

const router = express.Router();

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);

module.exports = router;
