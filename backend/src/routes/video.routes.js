const express = require("express");
const router = express.Router();
const {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  getSubscriberVideos,
  incrementViews,
  getSearchSuggestions,
} = require("../controllers/video.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const { upload } = require("../middlewares/upload.middleware.js");

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllVideos)
  .post(
    verifyJWT,
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
  );

router.route("/subscribed-videos").get(verifyJWT, getSubscriberVideos);
router
  .route("/:videoId")
  .get(getVideoById)
  .delete(verifyJWT, deleteVideo)
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);
router.route("/views/:videoId").put(incrementViews);
router.route("/search/suggestions").get(getSearchSuggestions);
module.exports = router;
