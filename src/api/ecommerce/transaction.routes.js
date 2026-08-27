const express = require("express");
const { addtransaction, getTransactionbyDate } = require("../../controllers/pos/transaction.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addTransactionSchema, getTransactionByDateSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.post('/addtransaction', validate(addTransactionSchema), addtransaction);
router.post('/getTransactionbyDate', validate(getTransactionByDateSchema), getTransactionbyDate);

module.exports = router;
