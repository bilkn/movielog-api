const express = require("express");
const {
  getMoviesByGenre,
  search,
  getFeaturedMovies,
  getMovieDetail,
} = require("../../controller/movieController");
const { authenticateToken } = require("@core/lib/middleware");

const router = express.Router();

router.get("/discover", authenticateToken, getMoviesByGenre);

router.get("/search", authenticateToken, search);

router.get("/featured", authenticateToken, getFeaturedMovies);

router.get("/:movieID", authenticateToken, getMovieDetail);

module.exports = router;
