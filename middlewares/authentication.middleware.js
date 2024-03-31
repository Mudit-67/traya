const JWTUtil = require("../utils/jwt.utils");
const { formatResponse } = require("../utils/general.util");

const apiLevelAuthentication = async (req, res, next) => {
  if (req?.headers?.authorization || req?.query?.auth) {
    const accessToken =
      req?.headers?.authorization.split(" ")[1] || req?.query?.auth;
    const tokenData = await JWTUtil.verifyAccessToken(accessToken)
    if (!tokenData.data) {
      return formatResponse(res, {message:"INVALID_TOKEN"}, 400);
    }
    req.user = tokenData.data.data
    next()
  } else {
    return formatResponse(res, {message:"TOKEN_MISSING"}, 400);
  }
};

module.exports = apiLevelAuthentication;
