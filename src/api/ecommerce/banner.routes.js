const express = require("express");
const { getBanner } = require("../../controllers/ecommerce/banner.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { getRetailBannerSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.post('/by-store', validate(getRetailBannerSchema), getBanner);

module.exports = router;
