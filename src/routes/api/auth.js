const express = require("express");
const router = express.Router();
const signupSchema = require("../../validations/signupValidation");
const validationMiddleware = require("../../middleware/auth/validationMiddleware");
const { signup } = require("../../controller/authController");

router.post("/signup", validationMiddleware(signupSchema), signup);


module.exports = router