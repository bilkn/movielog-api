const UserModel = require("../models/UserModel");

function createUser(email, password) {
  const newUser = new UserModel({ email, password });
  return newUser.save();
}

function isEmailExist(email) {
  return UserModel.exists({ email });
}

module.exports = { createUser, isEmailExist };
