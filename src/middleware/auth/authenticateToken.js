const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("authHeader", authHeader);
  const token = authHeader?.split(" ")[1];

  if (!token) res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err,user) => {
    console.log("token: ", token);
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "Failed to get authorization!" });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
