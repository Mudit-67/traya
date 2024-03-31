const AuthenticationService = require("../services/authentication.service");

const { formatResponse } = require("../utils/general.util");

const login = async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = "User login"
  /*
    #swagger.parameters['obj'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: 'User details object',
      schema: {
          $email: "mudit.rawat1996@gmail.com",
          $password: "aaBB11##"
      }
    }
  */
  const cred = req.body;
  const result = await AuthenticationService.loginUser(cred);
  if (result.success) {
    return formatResponse(res, result.data);
  }
  return formatResponse(res, result, result.status);
};

module.exports = {
  login
};
