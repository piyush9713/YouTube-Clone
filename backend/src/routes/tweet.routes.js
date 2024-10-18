const express = require("express");
const router = express.Router();
const {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} = require("../controllers/tweet.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

router.use(verifyJWT);

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

module.exports = router;
