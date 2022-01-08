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

const sendBadRequestError = (res, message) =>
  res.status(400).send({
    success: false,
    message,
  });

const getReleaseYear = (date) => date.split("-")[0];

const getCastByMovieID = async (id) => {
  const urlParams = createSearchParams();

  const {
    body: { cast },
  } = await needle("get", `${API_BASE_URL}/movie/${id}/credits?${urlParams}`);
  return cast.map(({ profile_path: profile, original_name: name }) => ({
    profile,
    name,
  }));
};

/* Reponse creators */

const createSearchResponse = async (data) => {
  const urlParams = createSearchParams();

  const {
    body: { genres },
  } = await needle("get", `${API_BASE_URL}/genre/movie/list?${urlParams}`);

  if (genres) {
    return data.map(
      ({ id, title, release_date, genre_ids, poster_path, vote_average }) => ({
        id,
        title,
        releaseYear: getReleaseYear(release_date),
        genres: genre_ids.map((genreID) => ({
          id: genreID,
          name: genres.find(({ id }) => id === genreID).name,
        })),
        poster: poster_path,
        rating: vote_average,
        watched: false,
        willWatch: false,
      })
    );
  }
};

const createMovieDetailResponse = async (data) => {
  const {
    genres,
    id,
    overview,
    poster_path,
    release_date,
    title,
    vote_average,
  } = data;

  const cast = await getCastByMovieID(id);

  return {
    cast,
    genres,
    id,
    overview,
    poster: poster_path,
    rating: vote_average,
    releaseYear: getReleaseYear(release_date),
    title,
    watched: false,
    willWatch: false,
  };
};

/* Controllers */

async function discover(req, res) {
  try {
    const { genres, page = 1 } = req.query;

    if (!genres) {
      const message = "Genre is not provided, please provide genre!";
      return sendBadRequestError(res, message);
    }

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
  const { q, page = 1 } = req.query;

  if (!q) {
    const message =
      "Search query is not provided, please provide search query!";
    return sendBadRequestError(res, message);
  }

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
    const response = await createSearchResponse(body.results);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function getFeaturedMovies(_, res) {
  try {
    const urlParams = createSearchParams();

    const { body } = await needle(
      "get",
      `${API_BASE_URL}/movie/popular?${urlParams}`
    );
    res.send(body);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

async function getMovieDetail(req, res) {
  try {
    const { movie } = req.params;

    if (!movie) {
      const message = "Movie id is not provided, please provide movie id!";
      return sendBadRequestError(res, message);
    }

    const urlParams = createSearchParams();

    const { body } = await needle(
      "get",
      `${API_BASE_URL}/movie/${movie}?${urlParams}`
    );

    const response = await createMovieDetailResponse(body);
    res.send(response);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  discover,
  search,
  getFeaturedMovies,
  getMovieDetail,
};
