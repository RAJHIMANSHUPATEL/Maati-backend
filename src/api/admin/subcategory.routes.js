const express = require("express");
const router = express.Router();
const { getSubcategory, addSubcategory, updateSubcategory, updateSubcategoryStatus, getSubCategoryByCategoryId } = require("../../controllers/admin/subcategory.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addSubcategorySchema, updateSubcategorySchema, updateSubcategoryStatusSchema, getSubcategoryByCategoryIdSchema } = require("../../utils/zod.schema");
const checkAdmin = require("../../middlewares/adminAuth.middleware");

router.use(checkAdmin);
router.get('/', getSubcategory);
router.post('/add', validate(addSubcategorySchema), addSubcategory);
router.post('/update', validate(updateSubcategorySchema), updateSubcategory);
router.post('/updatestatus', validate(updateSubcategoryStatusSchema), updateSubcategoryStatus);
router.post('/getbycategory', getSubCategoryByCategoryId);

module.exports = router;
