const express = require("express");
const { addOrder, getMyOrders, getMyOrderById } = require("../../controllers/ecommerce/order.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addOrderSchema, getOrderByIdRetailSchema } = require("../../utils/zod.schema");
const checkUser = require("../../middlewares/userAuth.middleware");

const router = express.Router();

router.get("/", checkUser, getMyOrders);
router.get("/by-id", checkUser, validate(getOrderByIdRetailSchema), getMyOrderById);
router.post("/addorder", checkUser, validate(addOrderSchema), addOrder);

module.exports = router;
