const { movieService } = require("../services");
const { sendBadRequestError } = require("../utils");

/* Controllers */

async function getMoviesByGenre(req, res) {
  try {
    const { genres, page = 1 } = req.query;
    const { user } = req;

    if (!genres) {
      const message = "Genre is not provided, please provide genre!";
      return sendBadRequestError(res, message);
    }

    const params = {
      with_genres: genres,
      page,
    };

    const movieListData = await movieService.getMoviesByGenre(params, user.id);

    res.send(movieListData);
  } catch (err) {
    res.status(500);
    console.log(err);
  }
}

async function search(req, res) {
  const { q, page = 1 } = req.query;
  const { user } = req;
  if (!q) {
    const message =
      "Search query is not provided, please provide search query!";
    return sendBadRequestError(res, message);
  }

  console.log("search movies");

  const params = {
    query: q,
    page,
  };

  try {
    const movieList = await movieService.searchMovies(params, user.id);
    return res.send(movieList);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

async function getFeaturedMovies(req, res) {
  const { user } = req;
  try {
    const featuredMovies = await movieService.getFeaturedMovies(user.id);
    return res.send(featuredMovies);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

async function getMovieDetail(req, res) {
  const { params, user } = req;

  try {
    const { movieID } = params;
    if (!movieID) {
      const message = "Movie id is not provided, please provide movie id!";
      return sendBadRequestError(res, message);
    }

    const movie = await movieService.getMovieDetail(user.id, movieID);
    res.send(movie);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

module.exports = {
  getMoviesByGenre,
  search,
  getFeaturedMovies,
  getMovieDetail,
};
