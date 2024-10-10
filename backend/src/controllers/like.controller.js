const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const { isValidObjectId } = require("mongoose");
const Like = require("../models/like.model.js");

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Video not found" });
  }

  const LikeCheck = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (LikeCheck) {
    await Like.deleteOne({ _id: LikeCheck._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unliked successfully"));
  }

  const like = new Like({
    video: videoId,
    likedBy: req.user._id,
  });

  try {
    await like.save();
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          like,
          "Congratulations! You have successfully liked the video"
        )
      );
  } catch (error) {
    return res.status(400).json({ error: "Failed to like video" });
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    return res.status(400).json({ error: "Invalid comment id" });
  }

  const like = await Like.findById({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (like) {
    await like.deleteOne({ comment: commentId });
    return res.json(new ApiResponse(200, null, "Comment unliked successfully"));
  }

  const likedComment = await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res.json(
    new ApiResponse(200, likedComment, "Comment liked successfully")
  );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    return res.status(400).json({ error: "Invalid tweet id" });
  }

  const like = await Like.findById({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (like) {
    await like.deleteOne({ tweet: tweetId });
    return res.json(new ApiResponse(200, null, "Tweet unliked successfully"));
  }

  const likedTweet = await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res.json(new ApiResponse(200, likedTweet, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const videos = await Like.find({
    likedBy: req.user._id,
    video: { $ne: null },
  }).populate({
    path: "video",
    populate: {
      path: "owner",
      select: "username avatar fullName",
    },
  });

  const likedVideos = videos
    .filter((video) => video.video && video.video.isPublished)
    .map((video) => video.video);

  if (likedVideos.length === 0) {
    return res.json(
      new ApiResponse(200, [], "You have not liked any video yet")
    );
  }

  return res.json(
    new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
  );
});

// Get like status and like count for a video
const getLikeStatus = async (req, res) => {
  const { videoId } = req.params;
  const userId = req?.user?.id; // Assuming you have user info in req.user from authentication middleware

  try {
    // Check if the user has liked the video
    const userLike = await Like.findOne({ video: videoId, likedBy: userId });
    const isLiked = userLike ? true : false;

    // Get the like count for the video
    const likesCount = await Like.countDocuments({ video: videoId });

    res.status(200).json(new ApiResponse(200, { isLiked, likesCount }));
  } catch (error) {
    res.status(500).json({ message: "Error fetching like status", error });
  }
};

module.exports = {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getLikeStatus,
};
