const express = require("express");
const router = express.Router();
const { getOrder, getOrderByMonth, getOrderByDate, getOrderByUserId, getOrderCount, updateOrder } = require("../../controllers/admin/order.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { getOrderByMonthSchema, getOrderByDateSchema, getOrderByUserIdSchema, getOrderCountSchema, updateOrderSchema } = require("../../utils/zod.schema");
const checkAdmin = require("../../middlewares/adminAuth.middleware");

router.use(checkAdmin);
router.get('/', getOrder);
router.post('/ordersbymonth', validate(getOrderByMonthSchema), getOrderByMonth);
router.post('/bydate', validate(getOrderByDateSchema), getOrderByDate);
router.post('/byuserid', validate(getOrderByUserIdSchema), getOrderByUserId);
router.get('/count', validate(getOrderCountSchema), getOrderCount);
router.post('/update', validate(updateOrderSchema), updateOrder);

module.exports = router;
