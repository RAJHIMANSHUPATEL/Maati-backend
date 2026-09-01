const express = require("express");
const router = express.Router();
const { getStore, addStore, updateStore, updateStoreStatus } = require("../../controllers/admin/store.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addStoreSchema, updateStoreSchema, updateStoreStatusSchema } = require("../../utils/zod.schema");
const checkStaff = require("../../middlewares/adminAuth.middleware");
const { requireOwner } = require("../../middlewares/adminAuth.middleware");

router.use(checkStaff);
router.get("/", getStore);
router.post("/add", requireOwner, validate(addStoreSchema), addStore);
router.post("/update", requireOwner, validate(updateStoreSchema), updateStore);
router.post("/updatestatus", requireOwner, validate(updateStoreStatusSchema), updateStoreStatus);

module.exports = router;
