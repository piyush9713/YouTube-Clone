const express = require("express");
const router = express.Router();
const {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} = require("../controllers/comment.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

router.route("/:videoId").get(getVideoComments).post(verifyJWT, addComment);
router
  .route("/c/:commentId")
  .delete(verifyJWT, deleteComment)
  .patch(verifyJWT, updateComment);

module.exports = router;
