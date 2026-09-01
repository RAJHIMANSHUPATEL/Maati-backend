const express = require("express");
const router = express.Router();
const { getPolicyPage, addPolicyPage, updatePolicyPage, updatePolicyPageStatus } = require("../../controllers/admin/policyPage.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addPolicyPageSchema, updatePolicyPageSchema, updatePolicyPageStatusSchema } = require("../../utils/zod.schema");
const checkStaff = require("../../middlewares/adminAuth.middleware");
const { requireOwner } = require("../../middlewares/adminAuth.middleware");

router.use(checkStaff, requireOwner);
router.get("/", getPolicyPage);
router.post("/add", validate(addPolicyPageSchema), addPolicyPage);
router.post("/update", validate(updatePolicyPageSchema), updatePolicyPage);
router.post("/updatestatus", validate(updatePolicyPageStatusSchema), updatePolicyPageStatus);

module.exports = router;
