const express = require("express");
const router = express.Router();
const {
  getChannelStats,
  getChannelVideos,
} = require("../controllers/dashboard.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

module.exports = router;
