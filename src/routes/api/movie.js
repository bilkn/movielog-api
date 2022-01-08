const express = require("express");
const { discover } = require("../../controller/movieController");
const { authenticateToken } = require("@core/lib/middleware");

const router = express.Router();

router.get("/discover", authenticateToken, discover);

module.exports = router;
