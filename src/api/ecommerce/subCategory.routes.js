const express = require("express");
const {
  subCategoryByStore,
} = require("../../controllers/ecommerce/subCategory.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { subCategoryByStoreSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.get(
  "/subcategory-by-category",
  validate(subCategoryByStoreSchema),
  subCategoryByStore
);

module.exports = router;
