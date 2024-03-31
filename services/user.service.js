const User = require("../schemas/user.model");

const GeneralPipeline = require("../general.pipeline");

const addUser = async (payload) => {
  try {
    const user = new User(payload);
    const addedUser = await user.save();
    if (addedUser?.user_id) {
      return { success: true, data: addedUser };
    } else {
      return ({message:"FAILED_PROFILE_SAVE", server_stack:addedUser, success: false, status: 500});
    }
  } catch (err) {
    return ({message:"FAILED_PROFILE_SAVE_DB", server_stack:err, success: false, status: 502});
  }
};

const getUsers = async (filters) => {
  try {
    let pipeline = GeneralPipeline.fetchFilterPipeline(filters);
    const result = await User.aggregate(pipeline);
    return { success: true, data: result };
  } catch (err) {
    return ({message:"FAILED_USER_FETCH_DB", server_stack:err, success: false, status: 500});
  }
};

const getUser = async (user_id) => {
  try {
    const result = await User.findOne(
      { user_id },
      { _id: 0, __v: 0, password: 0, createdAt: 0, updatedAt: 0 }
    ).lean();
    if (result?.user_id) {
      return { success: true, data: result };
    }
    return ({message:"USER_NOT_FOUND", server_stack:result, success: false, status: 404});
  } catch (err) {
    return ({message:"FAILED_USER_FETCH_DB", server_stack:err, success: false, status: 502});
  }
};

const getSuperUser = async () => {
  try {
    const result = await User.find(
      { role: 'ADMIN' },
      { _id: 0, __v: 0 }
    ).lean();
    if (result.length) {
      return { success: true, data: result };
    }
    return ({message:"USER_NOT_FOUND", server_stack:result, success: false, status: 404});
  } catch (err) {
    return ({message:"FAILED_USER_FETCH_DB", server_stack:err, success: false, status: 502});
  }
};

const existingUserCheck = async (email) => {
  try {
    const result = await User.findOne({ email }, { _id: 0, __v: 0 }).lean();
    if (!result?.user_id) {
      return { success: true, data: result };
    } else
      return ({message:"USER_EXISTS_WITH_GIVEN_EMAIL", server_stack:result, success: false, status: 500});
  } catch (err) {
    return ({message:"FAILED_USER_FETCH_DB", server_stack:err, success: false, status: 502});
  }
};

const fetchUserByEmail = async (email) => {
  try {
    const result = await User.findOne(
      { email }
    ).lean();
    if (result.email) {
      return { success: true, data: result };
    } else {
      return ({message:"PROFILE_FETCH_EMPTY", server_stack:result, success: false, status: 404});
    }
  } catch (err) {
    return ({message:"FAILED_USER_FETCH_DB", server_stack:err, success: false, status: 502});
  }
};

module.exports = {
  addUser,
  getUser,
  getUsers,
  getSuperUser,
  existingUserCheck,
  fetchUserByEmail
};
