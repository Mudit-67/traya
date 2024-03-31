const Joi = require("joi");

const validationObject = {
  limit: Joi.number(),
  page: Joi.number(),
  order_by: Joi.string(),
  order_direction: Joi.string(),
};

const sortingPaginationValidation = Joi.object(validationObject);

module.exports = { sortingPaginationValidation, validationObject };
