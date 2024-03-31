const bcrypt = require("bcrypt");

const UserService = require("./user.service");
const JWTUtil = require("../utils/jwt.utils");

const loginUser = async (cred) => {
  const userProfile = await UserService.fetchUserByEmail(cred.email);
  if (userProfile.success) {
    const validPassword = await bcrypt.compare(
      cred.password,
      userProfile?.data?.password
    );
    if (validPassword) {
      const userInfo = userProfile.data;
      const tokenValue = {
        user_id: userInfo.user_id,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role
      };
      const accessToken = await JWTUtil.generateToken(tokenValue);

        return {
          success: true,
          data: {
            access_token: accessToken,
            accessExpiresIn: 3600
          },
        }
    }
    return {message:"PROFILE_INCORRECT_PASSWORD",server_stack: validPassword,success: false,status: 500};
  } else {
    return {message:"PROFILE_NOT_FOUND",server_stack: userProfile,success: false,status: 404};
  }
};

module.exports = {
  loginUser
};
