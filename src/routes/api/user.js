const express = require("express");
const router = express.Router();
const {
  deleteAccount,
  deleteUserData,
  getUserInfo,
} = require("../../controller/userController");
const {
  validateValues,
  validateCredentials,
  authenticateToken,
} = require("@core/lib/middleware/");
const {
  deleteAccountSchema,
  deleteUserDataSchema,
} = require("@core/lib/validations/authValidation");

router.get("/", authenticateToken, getUserInfo);

router.delete(
  "/data",
  validateValues(deleteUserDataSchema),
  authenticateToken,
  validateCredentials,
  deleteUserData
);

router.delete(
  "/",
  validateValues(deleteAccountSchema),
  authenticateToken,
  validateCredentials,
  deleteAccount
);

module.exports = router;
