const express = require("express");
const router = express.Router();
const { getPosConfiguration, addPosConfiguration, updatePosConfiguration, updatePosConfigurationStatus } = require("../../controllers/admin/posConfiguration.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addPosConfigurationSchema, updatePosConfigurationSchema, updatePosConfigurationStatusSchema } = require("../../utils/zod.schema");
const checkStaff = require("../../middlewares/adminAuth.middleware");
const { requireOwner } = require("../../middlewares/adminAuth.middleware");

router.use(checkStaff, requireOwner);
router.get("/", getPosConfiguration);
router.post("/add", validate(addPosConfigurationSchema), addPosConfiguration);
router.post("/update", validate(updatePosConfigurationSchema), updatePosConfiguration);
router.post("/updatestatus", validate(updatePosConfigurationStatusSchema), updatePosConfigurationStatus);

module.exports = router;
