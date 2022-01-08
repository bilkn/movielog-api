const needle = require("needle");

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

const createSearchParams = (params) => {
  return new URLSearchParams({
    [API_KEY_NAME]: API_KEY_VALUE,
    ...params,
  });
};

async function discover(req, res) {
  try {
    const { genres, page } = req.query;

    const params = {
      with_genres: genres,
      page,
    };

    const urlParams = createSearchParams(params);

    const { body } = await needle(
      "get",
      `${API_BASE_URL}/discover/movie?${urlParams}`
    );
    res.send(body);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

async function search(req, res) {
  const { q, page } = req.query;

  const params = {
    query: q,
    page,
  };

  try {
    const urlParams = createSearchParams(params);

    const { body } = await needle(
      "get",
      `${API_BASE_URL}/search/movie?${urlParams}`
    );
    res.send(body);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function getFeaturedMovies(req, res) {
  try {
    const urlParams = createSearchParams();

    const { body } = await needle(
      "get",
      `${API_BASE_URL}/movie/popular?${urlParams}`
    );
    res.send(body);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  discover,
  search,
  getFeaturedMovies,
};
