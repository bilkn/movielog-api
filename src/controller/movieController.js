const { movieService } = require("../services");

/* Controllers */

async function getMoviesByGenre(req, res) {
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

    const movieList = await movieService.getMoviesByGenre(params);
    res.send(movieList);
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
    const movieList = await movieService.searchMovies(params);
    res.send(movieList);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function getFeaturedMovies(_, res) {
  try {
    const featuredMovies = await movieService.getFeaturedMovies();
    res.send(featuredMovies);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

async function getMovieDetail(req, res) {
  try {
    const { movieID } = req.params;

    if (!movieID) {
      const message = "Movie id is not provided, please provide movie id!";
      return sendBadRequestError(res, message);
    }

    const movie = await movieService.getMovieDetail(movieID);
    res.send(movie);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getMoviesByGenre,
  search,
  getFeaturedMovies,
  getMovieDetail,
};
