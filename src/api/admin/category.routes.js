const express = require("express");
const router = express.Router();
const { getCategory, addCategory, updateCategory, updateCategoryStatus, getCategoryByStoreId } = require("../../controllers/admin/category.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addCategorySchema, updateCategorySchema, updateCategoryStatusSchema } = require("../../utils/zod.schema");
const checkAdmin = require("../../middlewares/adminAuth.middleware");

router.use(checkAdmin);
router.get('/', getCategory);
router.post('/add', validate(addCategorySchema), addCategory);
router.post('/update', validate(updateCategorySchema), updateCategory);
router.post('/updatestatus', validate(updateCategoryStatusSchema), updateCategoryStatus);
router.get('/bystore', getCategoryByStoreId);

module.exports = router;
