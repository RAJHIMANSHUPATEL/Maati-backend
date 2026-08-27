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
const checkAdmin = require("../../middlewares/adminAuth.middleware");

router.use(checkAdmin);
router.get("/", getSubMenu); // get all or filtered
router.post("/add", validate(addSubMenuSchema), addSubMenu);
router.post("/update", validate(updateSubMenuSchema), updateSubMenu);
router.post("/updatestatus", validate(updateSubMenuStatusSchema), updateSubMenuStatus);

module.exports = router;
