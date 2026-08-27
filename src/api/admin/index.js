const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const bannerRoutes = require('./banner.routes');
const categoryRoutes = require('./category.routes');
const couponRoutes = require('./coupon.routes');
const orderRoutes = require('./order.routes');
const policyPageRoutes = require('./policyPage.routes');
const posConfigurationRoutes = require('./posConfiguration.routes');
const productRoutes = require('./product.routes');
const storeRoutes = require('./store.routes');
const subcategoryRoutes = require('./subcategory.routes');
const subMenuRoutes = require('./subMenu.routes');
const userRoutes = require('./user.routes');
const imageUploadRoute = require('./imageUpload.routes');
const settingsRoutes = require('./settings.routes');

router.use('/auth', authRoutes);
router.use('/banner', bannerRoutes);
router.use('/category', categoryRoutes);
router.use('/coupon', couponRoutes);
router.use('/policy-page', policyPageRoutes);
router.use('/pos-configuration', posConfigurationRoutes);
router.use('/product', productRoutes);
router.use('/store', storeRoutes);
router.use('/subcategory', subcategoryRoutes);
router.use('/sub-menu', subMenuRoutes);
router.use('/user', userRoutes);
router.use('/upload/image', imageUploadRoute);
router.use('/order', orderRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
