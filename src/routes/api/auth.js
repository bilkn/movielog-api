const express = require("express");
const router = express.Router();
const {
  signInSchema,
  signUpSchema,
} = require("../../validations/authValidation");
const validationMiddleware = require("../../middleware/auth/validationMiddleware");
const { signIn, signUp } = require("../../controller/authController");

router.post("/signup", validationMiddleware(signUpSchema), signUp);
router.post("/signin", validationMiddleware(signInSchema), signIn);

module.exports = router;
