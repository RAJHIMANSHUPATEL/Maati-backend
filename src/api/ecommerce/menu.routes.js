const express = require("express");
const { getMenu } = require("../../controllers/ecommerce/menu.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { getMenuSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.get('/', validate(getMenuSchema), getMenu);

module.exports = router;
