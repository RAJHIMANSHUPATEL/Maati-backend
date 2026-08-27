const express = require("express");
const router = express.Router();
const { getStore, addStore, updateStore, getStoreCount, updateStoreStatus } = require("../../controllers/admin/store.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addStoreSchema, updateStoreSchema, updateStoreStatusSchema } = require("../../utils/zod.schema");
const checkAdmin = require("../../middlewares/adminAuth.middleware");

router.use(checkAdmin);
router.get('/', getStore);
router.post('/add', validate(addStoreSchema), addStore);
router.post('/update', validate(updateStoreSchema), updateStore);
// router.get('/count', getStoreCount); //not in use currently
router.post('/updatestatus', validate(updateStoreStatusSchema), updateStoreStatus);

module.exports = router;
