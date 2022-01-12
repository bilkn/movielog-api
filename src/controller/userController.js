const { deleteUser, resetUserData } = require("@core/lib/services/UserService");
const needle = require("needle");
const { AUTH_SERVER_URL } = require("../constants/url");
const { sendBadRequestError } = require("../utils");

async function deleteAccount(req, res) {
  const { password, refreshToken } = req.body;
  const { id } = req.user;
  const data = { id, password, refreshToken };

  if (!id) {
    return sendBadRequestError(
      res,
      "User id is not provided, please provide user id."
    );
  }

  try {
    const response = await needle(
      "DELETE",
      `${AUTH_SERVER_URL}/auth/accounts`,
      data
    );

    if (!response.body.success) {
      return res.status(400).send(response.body);
    }
    await deleteUser(id);

    return res.send({
      success: true,
      message: "Account has been deleted successfully.",
    });
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

async function deleteUserData(req, res) {
  const { id } = req.user;

  try {
    await resetUserData(id);
    return res.status(200).send({
      success: true,
      message: "Your data has been deleted successfully.",
    });
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

function getUserInfo(req, res) {
  const { username } = req.user;
  res.send({ username });
}

module.exports = {
  deleteAccount,
  deleteUserData,
  getUserInfo,
};
