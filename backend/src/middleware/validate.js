function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = new Error('Request validation failed');
      error.statusCode = 400;
      error.details = result.error.flatten();
      return next(error);
    }

    req.body = result.data;
    return next();
  };
}

module.exports = { validate };
