const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const { getUser,createNewUser,setAddress }=require("../../controllers/user.controller");
const auth =require("../../middlewares/auth")


const router = express.Router();

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement a route definition for `/v1/users/:userId`

//router.use(validate(userValidation));
router.get("/:userId", auth , validate(userValidation.getUser), getUser);
router.put("/:userId", auth , validate(userValidation.setAddress), setAddress);
router.post("/createUser",createNewUser)
// const userController = require("../../controllers/user.controller");
// const auth = require("../../middlewares/auth");

// const router = express.Router();


// router.put(
//   "/:userId",
//   auth,
//   validate(userValidation.setAddress),
//   userController.setAddress
// );
const userController = require("../../controllers/user.controller");





router.put(
  "/:userId",
  auth,
  validate(userValidation.setAddress),
  userController.setAddress
);

module.exports = router;
