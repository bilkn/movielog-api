import * as jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split("Bearer")[1];

  if (!token) res.sendStatus(401);

  jwt.verify(token,process.env.ACCESS)
}
