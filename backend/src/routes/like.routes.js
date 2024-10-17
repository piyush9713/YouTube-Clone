const express = require("express");
const router = express.Router();
const {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
  getLikeStatus,
} = require("../controllers/like.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/toggle/c/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/toggle/t/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/videos").get(verifyJWT, getLikedVideos);
router.route("/status/v/:videoId").get(verifyJWT, getLikeStatus);
module.exports = router;
