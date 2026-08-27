const express = require("express");
const router = express.Router();

const bannerRoutes = require("./banner.routes");
const barcodeProductsRoutes = require("./barcodeProducts.routes");
const cartRoutes = require("./cart.routes");
const categoryRoutes = require("./category.routes");
const contactRoutes = require("./contact.routes");
const couponRoutes = require("./coupon.routes");
const menuRoutes = require("./menu.routes");
const orderRoutes = require("./order.routes");
const policyPagesRoutes = require("./policyPages.routes");
const productRoutes = require("./product.routes");
const storeRoutes = require("./store.routes");
const subCategoryRoutes = require("./subCategory.routes");
const subscriberRoutes = require("./subscriber.routes");
const transactionRoutes = require("./transaction.routes");
// const stripeRoutes = require("./stripe.routes");
const orderNumber = require("./orderNumber.routes");
const userRoutes = require("./user.routes");
const otpRoutes = require("./otp.routes")
const settingsRoutes = require("./settings.routes");

router.use("/store", storeRoutes);
router.use("/menu", menuRoutes);
router.use("/subscribe", subscriberRoutes);
router.use("/policy-pages", policyPagesRoutes);
router.use("/banner", bannerRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/sub-category", subCategoryRoutes);
router.use("/user", userRoutes);
router.use("/otp", otpRoutes);
router.use("/contact", contactRoutes);
router.use("/cart", cartRoutes);
router.use("/coupon", couponRoutes);
router.use("/order", orderRoutes);
// router.use("/stripe", stripeRoutes);
router.use("/transaction", transactionRoutes);
router.use("/order-number", orderNumber);
router.use("/settings", settingsRoutes);

module.exports = router;
