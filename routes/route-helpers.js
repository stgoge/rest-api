const Joi = require('joi');

const VALIDATION_ERROR_CODE = 400;

module.exports = {
  validateData: schema => (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      res.status(VALIDATION_ERROR_CODE).json(result.error);
      return;
    }
    req.body = result.value;
    next();
  },
  schemas: {
    authSchema: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
    recordSchema: Joi.object().keys({
      record: Joi.string().required(),
      date: Joi.date().default(Date.now()),
      status: Joi.number(),
      priority: Joi.number(),
      recordID: Joi.string(),
    }),
  },
};
