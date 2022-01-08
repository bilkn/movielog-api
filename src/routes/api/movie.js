const express = require("express");
const { discover, search } = require("../../controller/movieController");
const { authenticateToken } = require("@core/lib/middleware");

const router = express.Router();

router.get("/discover", authenticateToken, discover);

router.get("/search", authenticateToken, search);

module.exports = router;
