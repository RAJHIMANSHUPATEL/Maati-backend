const express = require("express");
const {
  getHomepageProducts,
  getFilteredProduct,
  getProductsByCategory,
  getProductById,
  productByCategoryId,
} = require("../../controllers/ecommerce/product.controller");
const { validate } = require("../../middlewares/validation.middleware");
const {
  getProductForHomeSchema,
  getFilterProductSchema,
} = require("../../utils/zod.schema");

const router = express.Router();

router.post(
  "/homepage-products",
  validate(getProductForHomeSchema),
  getHomepageProducts
);
router.post("/category-products", getProductsByCategory);
router.get("/", getProductById);
router.get("/category-id", productByCategoryId);
router.post(
  "/filter-products",
  validate(getFilterProductSchema),
  getFilteredProduct
);

module.exports = router;
