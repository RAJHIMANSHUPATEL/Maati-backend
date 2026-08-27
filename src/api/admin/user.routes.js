const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser, updateUser, updateUserStatus, getUserCount } = require("../../controllers/admin/user.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { registerUserSchema, loginUserSchema, updateUserSchema, updateUserStatusSchema } = require("../../utils/zod.schema");
const checkAdmin = require('../../middlewares/adminAuth.middleware');

router.post('/register', checkAdmin, validate(registerUserSchema), registerUser);
router.post('/login', validate(loginUserSchema), loginUser);
router.get('/', checkAdmin, (req, res) => getUser(req, res, "admin"));
router.get('/customers', checkAdmin, (req, res) => getUser(req, res, "user"));
router.get('/count', checkAdmin, getUserCount);
router.post('/update', checkAdmin, validate(updateUserSchema), updateUser);
router.post('/updatestatus', checkAdmin, validate(updateUserStatusSchema), updateUserStatus);

module.exports = router;
