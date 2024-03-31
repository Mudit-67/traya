require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.jwt_access_secret;

const generateToken = (data) => {
  return jwt.sign(
    {
      data,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtSecret, null, (err, tokenData) => {
    if (err) return {message:"INVALID_TOKEN", server_stack:err, success: false, status: 400};
    return { success: true, data: tokenData };
  });
};

module.exports = {
  generateToken,
  verifyAccessToken
};
