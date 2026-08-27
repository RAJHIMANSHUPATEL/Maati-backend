const express = require("express");
const {
  getCategory,
} = require("../../controllers/ecommerce/category.controller");
const { getCategorySchema } = require("../../utils/zod.schema");
const { validate } = require("../../middlewares/validation.middleware");

const router = express.Router();

router.get("/", validate(getCategorySchema), getCategory);

module.exports = router;
