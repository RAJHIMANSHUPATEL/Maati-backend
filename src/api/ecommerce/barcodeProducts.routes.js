const express = require("express");
const { getBarcodeProductsByStore, addBarcodeProduct, updateBarcodeProduct, getBarcodeProductsByBarcode } = require("../../controllers/pos/barcodeProducts.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addBarcodeProductSchema, getBarcodeProductsByStoreSchema, updateBarcodeProductSchema, getBarcodeProductsByBarcodeSchema } = require("../../utils/zod.schema");

const router = express.Router();

router.post('/', validate(addBarcodeProductSchema), addBarcodeProduct);
router.post('/by-store', validate(getBarcodeProductsByStoreSchema), getBarcodeProductsByStore);
router.put('/', validate(updateBarcodeProductSchema), updateBarcodeProduct);
router.post('/by-barcode', validate(getBarcodeProductsByBarcodeSchema), getBarcodeProductsByBarcode);

module.exports = router;
