const needle = require("needle");
const {
  checkIfItemExistsInList,
} = require("../../../../libs/core-lib/services/UserService");

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

const createMovieListResponse = async (data, userID) => {
  const urlParams = createSearchParams();
  const {
    body: { genres },
  } = await needle("get", `${API_BASE_URL}/genre/movie/list?${urlParams}`);
  if (genres) {
    return await Promise.all(
      data.map(
        async ({
          id,
          title,
          release_date,
          genre_ids,
          poster_path,
          vote_average,
        }) => {
          const watched = await checkIfItemExistsInList(
            userID,
            id,
            "watchedList"
          );

          const willWatch = await checkIfItemExistsInList(
            userID,
            id,
            "watchList"
          );

          return {
            id,
            title,
            releaseYear: release_date ? getReleaseYear(release_date) : "",
            genres: genre_ids.length
              ? genre_ids.map((genreID) => ({
                  id: genreID,
                  name: genres.find(({ id }) => id === genreID).name,
                }))
              : null,
            poster: poster_path,
            rating: vote_average,
            watched,
            willWatch,
          };
        }
      )
    );
  }
};

const createMovieDetailResponse = async (data, userID) => {
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
  const watched = await checkIfItemExistsInList(userID, id, "watchedList");
  const willWatch = await checkIfItemExistsInList(userID, id, "watchList");

  return {
    cast,
    genres,
    id,
    overview,
    poster: poster_path,
    rating: vote_average,
    releaseYear: getReleaseYear(release_date),
    title,
    watched,
    willWatch,
  };
};

/* Services */

async function getMovieDetail(userID, movieID) {
  const urlParams = createSearchParams();
  const { body } = await needle(
    "get",
    `${API_BASE_URL}/movie/${movieID}?${urlParams}`
  );

  return createMovieDetailResponse(body, userID);
}

async function getFeaturedMovies(userID) {
  const urlParams = createSearchParams();

  const {
    body: { results },
  } = await needle("get", `${API_BASE_URL}/movie/popular?${urlParams}`);

  return createMovieListResponse(results,userID);
}

async function searchMovies(params, userID) {
  const urlParams = createSearchParams(params);

  const {
    body: { results, total_pages, page },
  } = await needle("get", `${API_BASE_URL}/search/movie?${urlParams}`);

  return {
    total_pages,
    page,
    list: await createMovieListResponse(results, userID),
  };
}

async function getMoviesByGenre(params, userID) {
  const urlParams = createSearchParams(params);

  const {
    body: { results },
  } = await needle("get", `${API_BASE_URL}/discover/movie?${urlParams}`);

  return createMovieListResponse(results, userID);
}

module.exports = {
  getMovieDetail,
  getFeaturedMovies,
  getMoviesByGenre,
  searchMovies,
};
