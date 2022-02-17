const {
  addItemToList,
  getList,
  deleteItemFromList,
  checkIfItemExistsInList,
} = require("@core/lib/services/UserService");
const { movieService } = require("../services");
const { sendBadRequestError } = require("../utils");

const validLists = ["watchedList", "watchList"];
const listNames = {
  watchedList: "watched list",
  watchList: "watch list",
};

const listNameByMovieList = {
  watchedList: "watched",
  watchList: "willWatch",
};

/* const listNameByMovieListReversed = {
  watchedList: "willWatch",
  watchList: "watched",
}; */

const isListValid = (res, list) => {
  if (!list) {
    sendBadRequestError(
      res,
      "List query parameter is not found, please provide a query parameter!"
    );
    return false;
  }

  if (!validLists.includes(list)) {
    sendBadRequestError(res, "List query parameter is not valid!");
    return false;
  }
  return true;
};

async function addMovieToTheList(req, res) {
  const { id: userID } = req.user;
  const { list } = req.params;
  const { movie: movieID } = req.query;

  const otherList = {
    watchList: "watchedList",
    watchedList: "watchList",
  };

  try {
    if (await checkIfItemExistsInList(userID, movieID, list)) {
      return sendBadRequestError(res, "Item is already in the list!");
    }

    // It checks the other list and deletes it from the other list if the item exists.
    if (await checkIfItemExistsInList(userID, movieID, otherList[list])) {
      await deleteItemFromList(userID, otherList[list], movieID);
    }

    let movie = null;
    movie = await movieService.getMovieDetail(userID, movieID);

    let changedListName = null;
    if (list === "watchedList") {
      movie.watchDate = new Date();
      movie.watched = true;
      movie.willWatch = false;
      changedListName = "watched";
    } else {
      movie.watched = false;
      movie.willWatch = true;
      changedListName = "willWatch";
    }

    await addItemToList(userID, list, movie);

    return res.send({
      success: true,
      message: `Movie is added to your ${listNames[list]} successfully.`,
    });
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

async function getMovieList(req, res) {
  const { id: userID } = req.user;
  const { list } = req.params;
  const { page } = req.query;

  if (!isListValid(res, list)) return;

  const ITEMS_PER_PAGE = 10;
  const skip = page - 1 * ITEMS_PER_PAGE;
  console.log({page})
  try {
    const movieList = await getList(userID, list, skip);
    const { totalPages } = movieList[0];
    const movieListObj = {
      items: movieList[0][list],
      pagination: { totalPages, currentPage: page },
    };
    res.send(movieListObj);
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

    return res.send({
      success: true,
      message: `Movie is removed from your ${listNames[list]} successfully.`,
      data: {
        [listNameByMovieList[list]]: false,
      },
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
