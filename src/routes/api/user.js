const express = require("express");
const router = express.Router();
const { deleteAccount } = require("../../controller/userController");
const validateValues = require("@core/lib/middleware/validationMiddleware");
const { authenticateToken } = require("../../middleware/auth");
const { deleteAccountSchema } = require("@core/lib/validations/authValidation");

router.delete(
  "/users",
  validateValues(deleteAccountSchema),
  authenticateToken,
  deleteAccount
);

module.exports = router;
