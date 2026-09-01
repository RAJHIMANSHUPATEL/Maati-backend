const express = require("express");
const router = express.Router();
const {
    getSubMenu,
    addSubMenu,
    updateSubMenu,
    updateSubMenuStatus
} = require("../../controllers/admin/subMenu.controller");
const { validate } = require("../../middlewares/validation.middleware");
const {
    addSubMenuSchema,
    updateSubMenuSchema,
    updateSubMenuStatusSchema,
} = require("../../utils/zod.schema");
const checkStaff = require("../../middlewares/adminAuth.middleware");
const { requireOwner } = require("../../middlewares/adminAuth.middleware");

router.use(checkStaff, requireOwner);
router.get("/", getSubMenu);
router.post("/add", validate(addSubMenuSchema), addSubMenu);
router.post("/update", validate(updateSubMenuSchema), updateSubMenu);
router.post("/updatestatus", validate(updateSubMenuStatusSchema), updateSubMenuStatus);

module.exports = router;
