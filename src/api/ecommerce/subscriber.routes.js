const express = require("express");
const { addSubscriber } = require("../../controllers/ecommerce/subscriber.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addSubscriberSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.post('/', validate(addSubscriberSchema), addSubscriber);

module.exports = router;
