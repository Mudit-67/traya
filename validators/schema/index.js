const {
    userValidation
  } = require("./user.validation");

  const { sortingPaginationValidation } = require("./general.validation");

  const {
    loginValidation
  } = require("./authentication.validation");

  module.exports = {
    userValidation,
    sortingPaginationValidation,
    loginValidation
  }