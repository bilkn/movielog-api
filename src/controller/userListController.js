const {
  addItemToList,
  getList,
  deleteItemFromList,
} = require("@core/lib/services/UserService");
const { movieService } = require("../services");

const validLists = ["watchedList", "watchList"];
const listNames = {
  watchedList: "watched list",
  watchList: "watch list",
};

const isListValid = (res, list) => {
  if (!list) {
    return sendBadRequestError(
      res,
      "List query parameter is not found, please provide a query parameter!"
    );
  }

  if (!validLists.includes(list)) {
    return sendBadRequestError(res, "List query parameter is not valid!");
  }
  return true;
};

async function addMovieToTheList(req, res) {
  const { id: userID } = req.user;
  const { list } = req.params;
  const { movie: movieID } = req.query;

  if (!isListValid(res, list)) return;

  try {
    let movie = null;
    movie = await movieService.getMovieDetail(movieID);

    if (list === "watchedList") {
      movie.watchDate = new Date();
      movie.watched = true;
      movie.willWatch = false;
    } else {
      movie.watched = false;
      movie.willWatch = true;
    }

    await addItemToList(userID, list, movie);
    return res.send({
      success: true,
      message: `Movie is added to your ${listNames[list]} successfully.`,
      data: movie,
    });
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

async function getMovieList(req, res) {
  const { id: userID } = req.user;
  const { list } = req.params;

  if (!isListValid(res, list)) return;

  try {
    const movieList = await getList(userID, list);
    res.send(movieList);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

async function deleteMovieFromTheList(req, res) {
  const { id: userID } = req.user;
  const { movie: movieID } = req.query;
  const { list } = req.params;

  if (!isListValid(res, list)) return;

  try {
    const result = await deleteItemFromList(userID, list, movieID);

    console.log(result);

    if (!result.matchedCount) {
      return res
        .status(404)
        .send({ success: false, message: "Item could not be found!" });
    }

    if (!result.modifiedCount) {
      return res
        .status(404)
        .send({ success: false, message: "Item could not be modified!" });
    }

    res.send({
      success: true,
      message: `Movie is removed from your ${listNames[list]} successfully.`,
    });
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

module.exports = {
  addMovieToTheList,
  getMovieList,
  deleteMovieFromTheList,
};
