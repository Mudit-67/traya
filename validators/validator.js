const _ = require("lodash");

const { formatResponse } = require("../utils/general.util");

const Validations = require("./schema");

module.exports = function (validator, query = false, params = false) {
  if (!Validations.hasOwnProperty(validator))
    return new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      if (query) {
        if (!_.isEmpty(req.query)) {
          await Validations[validator].validateAsync(req.query);
        }
      } else if (params) {
        await Validations[validator].validateAsync(req.params);
      } else {
        const validated = await Validations[validator].validateAsync(req.body);
        req.body = validated;
      }
      next();
    } catch (err) {
      if (err.isJoi) return formatResponse(res, { error: err.message }, 400);
      return formatResponse(
        res,
        { error: "Error while validating request" },
        400
      );
    }
  };
};
