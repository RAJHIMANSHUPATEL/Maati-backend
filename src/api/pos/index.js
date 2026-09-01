const express = require("express");
const checkPos = require("../../middlewares/posAuth.middleware");
const { requireCashier } = require("../../middlewares/posAuth.middleware");
const { validate } = require("../../middlewares/validation.middleware");
const { listTills, unlockTill, signOn, signOff } = require("../../controllers/pos/auth.controller");
const {
  listCategories,
  listProducts,
  lookupBarcode,
} = require("../../controllers/pos/catalog.controller");
const {
  createSale,
  listTodaySales,
  voidSale,
  markPrinted,
} = require("../../controllers/pos/sale.controller");
const {
  posUnlockSchema,
  posBarcodeSchema,
  posSaleSchema,
  posSaleIdSchema,
  posSignonSchema,
} = require("../../utils/zod.schema");

const router = express.Router();

router.get("/tills", listTills);
router.post("/unlock", validate(posUnlockSchema), unlockTill);

router.use(checkPos);
router.post("/signon", validate(posSignonSchema), signOn);
router.post("/signoff", requireCashier, signOff);

router.use(requireCashier);
router.get("/categories", listCategories);
router.get("/products", listProducts);
router.post("/barcode", validate(posBarcodeSchema), lookupBarcode);
router.post("/sale", validate(posSaleSchema), createSale);
router.get("/sales/today", listTodaySales);
router.post("/sales/:id/void", validate(posSaleIdSchema), voidSale);
router.post("/sales/:id/printed", validate(posSaleIdSchema), markPrinted);

module.exports = router;
