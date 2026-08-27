const express = require("express");
const router = express.Router();
const checkAdmin = require('../../middlewares/adminAuth.middleware');
const { verifyUser } = require('../../controllers/admin/auth.controller');

router.get('/verify', checkAdmin, verifyUser);

module.exports = router;
