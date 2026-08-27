const express = require("express");
const { validate } = require("../../middlewares/validation.middleware");
const {
  registerEcomUserSchema,
  loginEcomUserSchema,
  updateUserSchema,
  updateEcomUserPasswordSchema,
  updateEcomUserAddressSchema,
  deleteEcomUserAddressSchema,
  resetPasswordSchema,
} = require("../../utils/zod.schema");
const {
  register,
  loginUser,
  verify_token,
  updateUser,
  updatePassword,
  updateUserAddress,
  deleteUserAddress,
  resetPassword,
} = require("../../controllers/ecommerce/user.controller");
const checkUser = require("../../middlewares/userAuth.middleware");

const router = express.Router();

router.post("/register", validate(registerEcomUserSchema), register);
router.post("/login", validate(loginEcomUserSchema), loginUser);
router.get("/auth/verify", verify_token);
router.put("/update-info", checkUser, validate(updateUserSchema), updateUser);
router.put("/update-password", checkUser, validate(updateEcomUserPasswordSchema), updatePassword);
router.put("/update-address", checkUser, validate(updateEcomUserAddressSchema), updateUserAddress);
router.delete("/delete-address", checkUser, validate(deleteEcomUserAddressSchema), deleteUserAddress);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

module.exports = router;

