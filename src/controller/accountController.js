const { deleteUser } = require("@core/lib/services/UserService");
const needle = require("needle");
const { AUTH_SERVER_URL } = require("../constants/url");

async function deleteAccount(req, res) {
  const { password, refreshToken } = req.body;
  const data = { password, refreshToken };

  console.log(req.user)
 /*   if (!user) {
    return res.status(400).send({
      success: false,
      message: "User id is not provided, please provide user id.",
    });
  }  */

  try {
    const response = await needle.delete(
      `${AUTH_SERVER_URL}/users/:${id}`,
      data
    );
    console.log("App server response", response);
    res.send(200);
    // !!! if response is other than 200, send an error.
    await deleteUser(id);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
}

module.exports = {
  deleteAccount,
};
