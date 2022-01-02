const RefreshTokenModel = require("../models/RefreshTokenModel");

function saveRefreshToken(token) {
  const refreshToken = new RefreshTokenModel({ token });
  return refreshToken.save();
}

module.exports = { saveRefreshToken };
