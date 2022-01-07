const jwt = require("jsonwebtoken");

const sendAuthenticationError = (res) => {
  res.status(401).send({ message: "Failed to get authorization!" });
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return sendAuthenticationError(res);

  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return sendAuthenticationError(res);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
