const express = require("express");
const { getStore } = require("../../controllers/ecommerce/store.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { getStoreByIdSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.get("/", validate(getStoreByIdSchema), getStore);

module.exports = router;
