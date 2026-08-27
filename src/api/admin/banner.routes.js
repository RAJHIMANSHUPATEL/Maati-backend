const express = require("express");
const router = express.Router();
const { getBanner, addBanner, updateBanner, updateBannerStatus } = require("../../controllers/admin/banner.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addBannerSchema, updateBannerSchema, updateBannerStatusSchema } = require("../../utils/zod.schema");
const checkAdmin = require("../../middlewares/adminAuth.middleware");

router.use(checkAdmin);
router.get('/', getBanner);
router.post('/add', validate(addBannerSchema), addBanner);
router.post('/update', validate(updateBannerSchema), updateBanner);
router.post('/updatestatus', validate(updateBannerStatusSchema), updateBannerStatus);

module.exports = router;
