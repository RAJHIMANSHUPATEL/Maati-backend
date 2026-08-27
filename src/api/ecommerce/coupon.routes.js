const express = require("express");
const { getCoupon, validateCoupon } = require("../../controllers/ecommerce/coupon.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { validateCouponSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.get("/getcoupon", getCoupon);
router.post("/validate", validate(validateCouponSchema), validateCoupon);

module.exports = router;
