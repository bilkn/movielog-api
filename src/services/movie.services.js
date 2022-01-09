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

const createMovieListResponse = async (data) => {
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

/* Services */

async function getMovieDetail(movieID) {
  const urlParams = createSearchParams();

  const { body } = await needle(
    "get",
    `${API_BASE_URL}/movie/${movieID}?${urlParams}`
  );

  return createMovieDetailResponse(body);
}

async function getFeaturedMovies() {
  const urlParams = createSearchParams();

  const {
    body: { results },
  } = await needle("get", `${API_BASE_URL}/movie/popular?${urlParams}`);

  return createMovieListResponse(results);
}

async function searchMovies(params) {
  const urlParams = createSearchParams(params);

  const {
    body: { results },
  } = await needle("get", `${API_BASE_URL}/search/movie?${urlParams}`);

  return createMovieListResponse(results);
}

async function getMoviesByGenre(params) {
  const urlParams = createSearchParams(params);

  const {
    body: { results },
  } = await needle("get", `${API_BASE_URL}/discover/movie?${urlParams}`);

  return createMovieListResponse(results);
}

module.exports = {
  getMovieDetail,
  getFeaturedMovies,
  getMoviesByGenre,
  searchMovies,
};
