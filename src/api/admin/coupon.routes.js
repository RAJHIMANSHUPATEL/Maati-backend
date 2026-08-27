const express = require("express");
const router = express.Router();
const { getCoupon, addCoupon, updateCoupon, updateCouponStatus } = require("../../controllers/admin/coupon.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addCouponSchema, updateCouponSchema, updateCouponStatusSchema } = require("../../utils/zod.schema");
const checkAdmin = require("../../middlewares/adminAuth.middleware");

router.use(checkAdmin);
router.get('/', getCoupon);
router.post('/add', validate(addCouponSchema), addCoupon);
router.post('/update', validate(updateCouponSchema), updateCoupon);
router.post('/updatestatus', validate(updateCouponStatusSchema), updateCouponStatus);

module.exports = router;
