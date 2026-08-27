const express = require("express");
const router = express.Router();
const { getProducts, addProduct, updateProduct, getProductCount, getProductsByCategory, updateProductStatus, adjustStock, getLowStock } = require("../../controllers/admin/product.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addProductSchema, updateProductSchema, updateProductStatusSchema, adjustStockSchema } = require("../../utils/zod.schema");
const checkAdmin = require("../../middlewares/adminAuth.middleware");

router.use(checkAdmin);
router.get('/', getProducts);
router.post('/add', validate(addProductSchema), addProduct);
router.post('/update', validate(updateProductSchema), updateProduct);
router.get('/count', getProductCount);
router.get('/getProductsByCategoryCount', getProductsByCategory);
router.post('/updatestatus', validate(updateProductStatusSchema), updateProductStatus);
router.post('/adjust-stock', validate(adjustStockSchema), adjustStock);
router.get('/low-stock', getLowStock);

module.exports = router;
