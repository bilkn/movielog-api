const express = require("express");
const {
  discover,
  search,
  getFeaturedMovies,
} = require("../../controller/movieController");
const { authenticateToken } = require("@core/lib/middleware");

const router = express.Router();

router.get("/discover", authenticateToken, discover);

router.get("/search", authenticateToken, search);

router.get("/featured", authenticateToken, getFeaturedMovies);

module.exports = router;
