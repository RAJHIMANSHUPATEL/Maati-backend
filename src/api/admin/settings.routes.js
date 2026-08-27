const express = require("express");
const { getSettings, updateSettings, getContacts } = require("../../controllers/admin/settings.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { updateSettingsSchema } = require("../../utils/zod.schema");
const checkAdmin = require("../../middlewares/adminAuth.middleware");

const router = express.Router();

router.use(checkAdmin);
router.get("/", getSettings);
router.post("/update", validate(updateSettingsSchema), updateSettings);
router.get("/contacts", getContacts);

module.exports = router;
