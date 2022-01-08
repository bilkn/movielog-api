const express = require("express");
const router = express.Router();
const {
  deleteAccount,
  deleteUserData,
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

router.delete(
  "/user/data",
  validateValues(deleteUserDataSchema),
  authenticateToken,
  validateCredentials,
  deleteUserData
);

router.delete(
  "/user",
  validateValues(deleteAccountSchema),
  authenticateToken,
  validateCredentials,
  deleteAccount
);

module.exports = router;
