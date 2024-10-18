const express = require("express");
const router = express.Router();
const {
  getChannelStats,
  getChannelVideos,
} = require("../controllers/dashboard.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

router.use(verifyJWT);

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

module.exports = router;
