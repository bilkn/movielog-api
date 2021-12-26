async function signUp(req, res) {
  res.status(200).send({ username: "Jamiryo successo" });
}

async function signIn(req, res) {
  res.status(200).send({ username: "Jamiryo successo" });
}

module.exports = { signUp,signIn };
