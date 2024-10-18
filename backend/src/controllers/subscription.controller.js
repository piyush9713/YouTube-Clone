const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const { isValidObjectId } = require("mongoose");
const Subscription = require("../models/subscription.model.js");

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    return res.status(400).json({ error: "Channel not found" });
  }

  const subscriptionCheck = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (subscriptionCheck) {
    await Subscription.deleteOne({ _id: subscriptionCheck._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Subscription removed successfully"));
  }

  const createSubscription = await Subscription.create({
    channel: channelId,
    subscriber: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createSubscription,
        "Congratulation! You have Successfully Subscribed to this channel"
      )
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    return res.status(400).json({ error: "Channel not found" });
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "Subscriber",
    "fullName username email avatar coveraImage"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    return res.status(400).json({ error: "Subscriber not found" });
  }

  const getSubscribedChannels = await Subscription.find({
    subscriber: subscriberId,
  }).populate("Channel", "fullName username email avatar coveraImage");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getSubscribedChannels,
        "Subscribed channels fetched successfully"
      )
    );
});

const getSubscriptionStatus = async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user.id;

  try {
    const userSubscription = await Subscription.findOne({
      channel: channelId,
      subscriber: userId,
    });
    const isSubscribed = userSubscription ? true : false;

    res.status(200).json(new ApiResponse(200, { isSubscribed }, "OK"));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subscription status", error });
  }
};

module.exports = {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  getSubscriptionStatus,
};
