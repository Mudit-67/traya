const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const Validator = require("../validators/validator");

const apiLevelAuthentication = require("../middlewares/authentication.middleware");

router.post(
  "/super",
  Validator("userValidation"),
  UserController.addSuperUser
);

router.post("/register", Validator("userValidation"), UserController.addUser);

router.use(apiLevelAuthentication);
router.get(
  "/allUsers",
  Validator("sortingPaginationValidation", true),
  UserController.getUsers
);
router.get("/user/:user_id", UserController.getUser);

module.exports = router;
