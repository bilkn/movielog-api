const { hashSync } = require("bcrypt");
const { createUser, isEmailExist } = require("../service/AuthService");
const { saveRefreshToken } = require("../service/RefreshTokenService");
const jwt = require("jsonwebtoken");

const createAccessToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (data) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY);
};

async function signUp(req, res) {
  const { email, password } = req.body;

  try {
    if (await isEmailExist(email)) {
      return res.status(403).send({
        success: false,
        message: "That email address is already in use.",
      });
    }

    const hashedPassword = hashSync(password, 10);
    await createUser(email, hashedPassword);

    const accessToken = createAccessToken({ email })
    const refreshToken = createRefreshToken({ email });
    await saveRefreshToken(refreshToken);

    await res.status(200).json({ accessToken, refreshToken });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
}

async function signIn(req, res) {
  res.status(200).send({ username: "Jamiryo successo" });
}

module.exports = { signUp, signIn };
