const sendBadRequestError = (res, message) =>
  res.status(400).send({
    success: false,
    message,
  });

module.exports = sendBadRequestError;
