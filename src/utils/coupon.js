const Coupon = require("../models/coupon.model");

const computeDiscount = (coupon, subTotal) => {
  const total = Number(subTotal) || 0;
  if (!coupon) return 0;
  if (coupon.discount_type === "percent") {
    return Math.round(((total * coupon.discount_value) / 100) * 100) / 100;
  }
  return Math.min(Number(coupon.discount_value) || 0, total);
};

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findValidCoupon = async (code, storeId) => {
  if (!code) return null;
  const coupon = await Coupon.findOne({
    coupon_code: new RegExp(`^${escapeRegex(String(code).trim())}$`, "i"),
    store: storeId,
    status: "active",
  });
  if (!coupon) {
    return { error: "Invalid coupon code" };
  }
  if (coupon.exp_date && new Date(coupon.exp_date) < new Date()) {
    return { error: "Coupon has expired" };
  }
  return { coupon };
};

module.exports = { computeDiscount, findValidCoupon };
