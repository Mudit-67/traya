const {
    superUserValidation,
    userValidation
  } = require("./user.validation");

  const { sortingPaginationValidation } = require("./general.validation");

  const {
    loginValidation
  } = require("./authentication.validation");

  module.exports = {
    superUserValidation,
    userValidation,
    sortingPaginationValidation,
    loginValidation
  }