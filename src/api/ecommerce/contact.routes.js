const express = require("express");
const { addContact } = require("../../controllers/ecommerce/contact.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addContactSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.post('/', validate(addContactSchema), addContact);

module.exports = router;
