const { deleteUser, resetUserData } = require("@core/lib/services/UserService");
const needle = require("needle");
const { AUTH_SERVER_URL } = require("../constants/url");
const { sendBadRequestError } = require("../utils");
const { findUserByUsername } = require("@core/lib/services/AuthService");

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

async function getUserInfo(req, res) {
  const { include = "" } = req.query;
  const { username } = req.user;
  const validParams = ["email", "username"];

  try {
    let includedFields = {};
    if (include instanceof Array) {
      includedFields = include.reduce(
        (acc, cur) => {
          if (validParams.includes(cur)) {
            acc[cur] = 1;
          }
          return acc;
        },
        { username: 1 }
      );
    } else if (validParams.includes(include)) {
      includedFields[include] = 1;
    }

    const userInfo = await findUserByUsername(username, {
      _id: 0,
      username: 1,
      ...includedFields,
    });
    console.log(userInfo);
    return res.send(userInfo);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

module.exports = {
  deleteAccount,
  deleteUserData,
  getUserInfo,
};
