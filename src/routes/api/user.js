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
  addMovieToTheList,
  getMovieList,
} = require("../../controller/userListController");

const {
  deleteAccountSchema,
  deleteUserDataSchema,
} = require("@core/lib/validations/authValidation");

router.get("/", authenticateToken, getUserInfo);

router.delete(
  "/",
  validateValues(deleteAccountSchema),
  authenticateToken,
  validateCredentials,
  deleteAccount
);

router.delete(
  "/data",
  validateValues(deleteUserDataSchema),
  authenticateToken,
  validateCredentials,
  deleteUserData
);

router
  .route("/list/:list")
  .put(authenticateToken, addMovieToTheList)
  .get(authenticateToken, getMovieList);

module.exports = router;
