const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const Tweet = require("../models/tweet.model.js");
const { isValidObjectId } = require("mongoose");

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const user = req.user?._id;

  const tweet = await Tweet.create({
    content,
    owner: user,
  });

  return res.json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const userTweet = Tweet.find({ owner: userId });
  return res.json(
    new ApiResponse(200, userTweet, "User tweets fetched successfully")
  );
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  if (content === "") {
    return res.status(400).json({ error: "Content cannot be empty" });
  }
  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  return res.json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  await Tweet.findByIdAndDelete(tweetId);
  return res.json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

module.exports = {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
};
