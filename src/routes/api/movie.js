const express = require("express");
const { discover } = require("../../controller/movieController");

const router = express.Router();

router.get("/discover", discover);

module.exports = router;
