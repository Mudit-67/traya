const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

const { formatResponse } = require("../utils/general.util");
const UserService = require("../services/user.service");

const saltRounds = Number(process.env.salt_rounds);

const addSuperUser = async (req, res) => {
  // #swagger.tags = ['Internal']
  // #swagger.summary = "Create Super User (For Backend Only)"
  /*
    #swagger.parameters['obj'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: 'Super User details object',
      schema: {
        $name: "John Wick",
        $email: "mudit.rawat1996@gmail.com",
        $password: "Abc@123"
      }
    }
  */
  const user = req?.body;
  const existing_user = await UserService.existingUserCheck(
    req.body.email
  );
  if (!existing_user.success) {
    return formatResponse(res, existing_user, existing_user.status);
  }
  const existing_super = await UserService.getSuperUser();
  if (existing_super.success) {
    return formatResponse(
      res,
      { message: "Only first Super Admin can be added with this API" },
      400
    );
  }
  // Encrypt password
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  user.user_id = uniqid();
  user.password = hashedPassword;
  user.role = 'ADMIN';

  const result = await UserService.addUser(user);
  return formatResponse(res, result, result.status);
};

const addUser = async (req, res) => {
  // #swagger.tags = ['Adminstrator - User']
  // #swagger.summary = "Create User (Only Super User)"
  /*
    #swagger.parameters['authorization'] = {
      in: 'header',
      type: 'string',
      required: true,
      description: 'Authorization token'
    }
  */
  /*
    #swagger.parameters['obj'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: 'User details object',
      schema: {
        $name: "user1",
        $email: "mudit762@gmail.com"
      }
    }
  */
  const user = req?.body;
  const existing_user = await UserService.existingUserCheck(
    req?.body?.email
  );
  if (!existing_user.success) {
    return formatResponse(res, existing_user, existing_user.status);
  }
  user.user_id = uniqid();
  user.role = 'USER'
  const tempPass = 'aaBB11##';
  // const tempPass = uniqid(); --->uncomment this line to generate random password to mail and comment above line

  // Encrypt password
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(tempPass, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  user.password = hashedPassword;
  const result = await UserService.addUser(user);
  if(result?.data?.user_id){
    const mail = await sendMail(user.email, tempPass);
  }
  return formatResponse(res, result, result.status);
};

const getUsers = async (req, res) => {
  // #swagger.tags = ['Adminstrator - User']
  // #swagger.summary = "Get Users (Only Super User)"
  /*
    #swagger.parameters['authorization'] = {
      in: 'header',
      type: 'string',
      required: true,
      description: 'Authorization token'
    }
  */
  /*
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: 'Number of items per page'
    }
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: 'Page number'
    }
    #swagger.parameters['order_by'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: 'Default: updatedAt'
    }
    #swagger.parameters['order_direction'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: 'Possible value: [ASC, DESC]'
    }
  */
 const user = req?.user;
 if(user?.role !== 'ADMIN'){
  return formatResponse(res, {message:'You are not authorized, only admin can view users'}, 401)
 }
  const filters = req?.query;
  const results = await UserService.getUsers(filters);
  return formatResponse(res, results, results.status);
};

const getUser = async (req, res) => {
  // #swagger.tags = ['Adminstrator - User']
  // #swagger.summary = "Get User (Only Super User)"
  /*
    #swagger.parameters['authorization'] = {
      in: 'header',
      type: 'string',
      required: true,
      description: 'Authorization token'
    }
  */
  /*
    #swagger.parameters['user_id'] = {
      in: 'path',
      type: 'string',
      required: true,
      description: 'User id is required'
    }
  */
  const user_id = req?.params?.user_id;
  if (!user_id)
    return formatResponse(res, { message: "User id is required" }, 400);
  const user = req?.user
  if(user?.role !== 'ADMIN'){
    return formatResponse(res, {message:'You are not authorized, only admin can view users'}, 401)
   }
  const result = await UserService.getUser(user_id);
  return formatResponse(res, result, result.status);
};

async function sendMail(email, password){
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Specify the email service provider
    auth: {
      user: 'mudit.rawat1996@gmail.com', // Your email address
      pass: process.env.app_specific_password // Your email password or app-specific password
    }
  });
  
  // Email content
  const mailOptions = {
    from: 'mudit.rawat1996@gmail.com', // Sender email address
    to: email, // Recipient email address
    subject: 'Traya user temporary password mail', // Email subject
    text: `Please login with your temporary password: ${password}` // Email body (plain text)
  };
  
  // Send email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = {
  addSuperUser,
  addUser,
  getUsers,
  getUser
};
