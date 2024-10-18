const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const Video = require("../models/video.model.js");

const getChannelStats = asyncHandler(async (req, res) => {
  // Check for unauthorized access
  if (!req.user._id) {
    throw new ApiError(400, "Unauthorized access");
  }

  const userId = req.user._id;

  const channelStats = await Video.aggregate([
    {
      $match: { owner: userId },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likedVideos",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "videoComments",
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "owner",
        foreignField: "owner",
        as: "tweets",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        subscribers: { $first: "$subscribers" },
        subscribedTo: { $first: "$subscribedTo" },
        totalLikes: { $sum: { $size: "$likedVideos" } },
        totalComments: { $sum: { $size: "$videoComments" } },
        // totalTweets: { $sum: { $size: "$tweets" } },
      },
    },
    {
      $project: {
        _id: 0,
        totalVideos: 1,
        totalViews: 1,
        subscribers: { $size: "$subscribers" },
        subscribedTo: { $size: "$subscribedTo" },
        totalLikes: 1,
        totalComments: 1,
        // totalTweets: 1,
      },
    },
  ]);

  return res.json(
    new ApiResponse(200, channelStats[0], "Channel stats fetched successfully")
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  if (!req.user._id) {
    return res.status(400).json({ error: "Unauthorized access" });
  }

  const videos = await Video.find({ owner: req.user._id }).populate(
    "owner",
    "username avatar fullName"
  );

  if (!videos[0]) {
    return res.json(
      new ApiResponse(200, [], "You have not uploaded any video yet")
    );
  }

  return res.json(
    new ApiResponse(200, videos, "Channel videos fetched successfully")
  );
});

module.exports = {
  getChannelStats,
  getChannelVideos,
};
