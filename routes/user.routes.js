const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const Validator = require("../validators/validator");

const apiLevelAuthentication = require("../middlewares/authentication.middleware");

router.post(
  "/super",
  Validator("superUserValidation"),
  UserController.addSuperUser
);

router.use(apiLevelAuthentication);

router.post("/", Validator("userValidation"), UserController.addUser);
router.get(
  "/",
  Validator("sortingPaginationValidation", true),
  UserController.getUsers
);
router.get("/:user_id", UserController.getUser);

module.exports = router;
