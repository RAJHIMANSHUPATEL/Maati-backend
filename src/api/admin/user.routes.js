const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser, updateUser, updateUserStatus, getUserCount } = require("../../controllers/admin/user.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { registerUserSchema, loginUserSchema, updateUserSchema, updateUserStatusSchema } = require("../../utils/zod.schema");
const { requireOwner } = require("../../middlewares/adminAuth.middleware");
const checkStaff = require("../../middlewares/adminAuth.middleware");

router.post("/register", checkStaff, requireOwner, validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.get("/", checkStaff, requireOwner, (req, res) => getUser(req, res, "staff"));
router.get("/customers", checkStaff, (req, res) => getUser(req, res, "user"));
router.get("/count", checkStaff, getUserCount);
router.post("/update", checkStaff, requireOwner, validate(updateUserSchema), updateUser);
router.post("/updatestatus", checkStaff, requireOwner, validate(updateUserStatusSchema), updateUserStatus);

module.exports = router;
