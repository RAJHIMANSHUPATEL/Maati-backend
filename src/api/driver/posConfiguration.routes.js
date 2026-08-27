const express = require("express");
const { getPosConfigurationByMac } = require("../../controllers/driver/posConfiguration.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { getPosConfigurationByMacSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.post('/getbymac', validate(getPosConfigurationByMacSchema), getPosConfigurationByMac);

module.exports = router;
