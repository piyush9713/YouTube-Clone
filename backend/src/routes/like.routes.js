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

router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);
router.route("/status/v/:videoId").get(getLikeStatus);
module.exports = router;
