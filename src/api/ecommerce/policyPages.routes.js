const express = require("express");
const { getPolicyPagesList, getPolicyPageById } = require("../../controllers/ecommerce/policyPages.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { getPolicyPageByIdSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.get('/', getPolicyPagesList);
router.get('/get-policypage-by-id', validate(getPolicyPageByIdSchema), getPolicyPageById);

module.exports = router;
