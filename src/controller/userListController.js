const { addItemToList } = require("@core/lib/services/UserService");
const { movieService } = require("../services");

async function addMovieToTheList(req, res) {
  const validLists = ["watchedList", "watchList"];
  const listNames = {
    watchedList: "watched list",
    watchList: "watch list",
  };
  const { id: userID } = req.user;
  const { list } = req.params;
  const { movie: movieID } = req.query;

  if (!list) {
    return sendBadRequestError(
      res,
      "List query parameter is not found, please provide a query parameter!"
    );
  }

  if (!validLists.includes(list)) {
    return sendBadRequestError(res, "List query parameter is not valid!");
  }

  try {
    const movie = await movieService.getMovieDetail(movieID);
    addItemToList(userID, [list], movie);
    return res.send({
      success: true,
      message: `Movie is added to your ${listNames[list]} successfully.`,
      data: movie,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  addMovieToTheList,
};
