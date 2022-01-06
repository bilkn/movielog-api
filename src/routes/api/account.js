const express = require("express");
const router = express.Router();
const { deleteAccount } = require("../../controller/accountController");
const validateValues = require("@core/lib/middleware/validationMiddleware");
const { authenticateToken } = require("../../middleware/auth/");
const { deleteAccountSchema } = require("@core/lib/validations/authValidation");

router.delete(
  "/account",
  validateValues(deleteAccountSchema),
  authenticateToken,
  deleteAccount
);

module.exports = router;
