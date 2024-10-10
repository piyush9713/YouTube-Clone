const express = require("express");
const router = express.Router();
const {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
  getSubscriptionStatus,
} = require("../controllers/subscription.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(getSubscribedChannels)
  .post(toggleSubscription);

router.route("/u/:subscriberId").get(getUserChannelSubscribers);
router.route("/status/c/:channelId").get(getSubscriptionStatus);
module.exports = router;
