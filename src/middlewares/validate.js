const httpStatus = require('http-status').status;
const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    next(error);
  }
};

module.exports = validate;