const needle = require("needle");

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

async function discover(req, res) {
  try {
    const { genres, page } = req.query;
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      with_genres: genres,
      page,
    });

    const { body } = await needle(
      "get",
      `${API_BASE_URL}/discover/movie?${params}`
    );
    res.send(body);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

async function search(req, res) {
  const { q, page } = req.query;
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      query: q,
      page,
    });

    const { body } = await needle(
      "get",
      `${API_BASE_URL}/search/movie?${params}`
    );
    res.send(body);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

module.exports = {
  discover,
  search,
};
