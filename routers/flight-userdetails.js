const router = require("express").Router();
const UserDetailsController = require("../controllers/flight-userDetails-controller.js");

router
  .route("/:userId")
  .get(UserDetailsController.getAllUserDetails)
  .post(UserDetailsController.addNewUserDetail);

router
  .route("/:userId/:userDetailId")
  .get(UserDetailsController.getUserDetail)
  .delete(UserDetailsController.deleteUserDetail)
  .put(UserDetailsController.replaceUserDetail);

module.exports = router;
