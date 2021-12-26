const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (err) {
    console.log(err);
    const mappedErrors = err.inner.map(({ path, message }) => ({
      name: path,
      message,
    }));
    return res.status(400).json(mappedErrors  );
  }
};

module.exports = validate;
