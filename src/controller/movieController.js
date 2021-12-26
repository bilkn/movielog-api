const needle = require("needle");

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

async function discover(req, res) {
  try {
    const { genres } = req.query;
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      with_genres: genres,
    });

    console.log("params", `${API_BASE_URL}/discover/movie?${params}`);
    const response = await needle(
      "get",
      `${API_BASE_URL}/discover/movie?${params}`
    );

    res.json(response.body);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

module.exports = {
  discover,
};
