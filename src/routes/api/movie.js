const express = require("express");
const { discover } = require("../../controller/movieController");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

router.get("/discover", authenticateToken, discover);

module.exports = router;
