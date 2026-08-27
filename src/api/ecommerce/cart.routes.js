const express = require("express");
const { addCart, getCart } = require("../../controllers/ecommerce/cart.controller");
const checkUser = require("../../middlewares/userAuth.middleware");
const { validate } = require("../../middlewares/validation.middleware");
const { addCartSchema, getCartSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.post('/', checkUser, validate(addCartSchema), addCart);
router.get('/', checkUser, validate(getCartSchema), getCart);

module.exports = router;
