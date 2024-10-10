const express = require("express");
const router = express.Router();
const {
  loginUser,
  logoutUser,
  registerUser,
  //   refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  updateAccountDetails,
  SaveWatchHistory,
} = require("../controllers/user.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const { upload } = require("../middlewares/upload.middleware.js");
const {
  validateRegisterData,
  validateLoginData,
} = require("../validations/userValidationSchema.js");

router.route("/register").post(validateRegisterData, registerUser);

router.route("/login").post(validateLoginData, loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
// router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(
  verifyJWT,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateAccountDetails
);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);
router.route("/save-history/:videoId").post(verifyJWT, SaveWatchHistory);

module.exports = router;
