const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const Comment = require("../models/comment.model.js");
const { isValidObjectId } = require("mongoose");

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10, sort = "desc" } = req.query;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Invalid video id" });
  }

  const skip = (page - 1) * limit;

  const comments = await Comment.find({ video: videoId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort })
    .populate("owner", "username avatar fullName")
    .exec();

  if (!comments || comments.length === 0) {
    return res.status(202).json("No comments found for this video");
  }

  return res.json(
    new ApiResponse(200, comments, "Comments fetched successfully")
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Invalid video id" });
  }

  const createComment = await Comment.create({
    video: videoId,
    content: content,
    owner: req.user._id,
  });

  const newComment = await createComment.populate("owner", "username avatar");

  return res.json(
    new ApiResponse(201, newComment, "Comment created successfully")
  );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    return res.status(400).json({ error: "Invalid comment id" });
  }

  if (!content) {
    return res.status(400).json({ error: "Please provide content" });
  }

  const updatedCommentContent = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: { content: content },
    },
    { new: true }
  );

  if (!updatedCommentContent) {
    return res.status(404).json({ error: "Comment not found" });
  }

  return res.json(
    new ApiResponse(200, updatedCommentContent, "Comment updated successfully")
  );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    return res.status(400).json({ error: "Invalid comment id" });
  }

  await Comment.findByIdAndDelete({ _id: commentId });

  return res.json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

module.exports = {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
};
