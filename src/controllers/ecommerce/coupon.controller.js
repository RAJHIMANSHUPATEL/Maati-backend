const Coupon = require('../../models/coupon.model');
const { findValidCoupon, computeDiscount } = require('../../utils/coupon');

const getCoupon = async (req, res) => {
    try {
      const data = await Coupon.find({ status: "active" });
      return res.status(200).json({ success: true, message: "Coupon get successfully", data: data });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

const validateCoupon = async (req, res) => {
  try {
    const { code, store, sub_total } = req.body;
    const result = await findValidCoupon(code, store);
    if (!result) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }
    const discount = computeDiscount(result.coupon, sub_total || 0);
    return res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: {
        _id: result.coupon._id,
        coupon_code: result.coupon.coupon_code,
        discount_type: result.coupon.discount_type,
        discount_value: result.coupon.discount_value,
        discount,
        description: result.coupon.description,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getCoupon, validateCoupon };
