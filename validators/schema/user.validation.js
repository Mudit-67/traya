const Joi = require("joi");

const userValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    "string.email": "Email is not valid",
  }),
  password: Joi.string().required(),
});

module.exports = {
  userValidation
};
