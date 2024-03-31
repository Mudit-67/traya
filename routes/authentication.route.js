const express = require("express");
const router = express.Router();

const Validator = require("../validators/validator");
const AuthenticationController = require("../controllers/authentication.controller");

router.post(
  "/login",
  Validator("loginValidation"),
  AuthenticationController.login
);

module.exports = router;
