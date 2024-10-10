const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const Video = require("../models/video.model.js");
const Subscription = require("../models/subscription.model"); // Assuming you have a Subscription model
const mongoose = require("mongoose");
const {
  deleteFileFromCloudinary,
} = require("../utils/deleteFileFromCloudinary.js");
const isValidObjectId = mongoose.isValidObjectId;

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = 1,
  } = req.query;

  const pipeline = Video.aggregate([
    {
      $match: {
        isPublished: true,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: "$avatar",
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
    {
      $sort: {
        [sortBy || "createdAt"]: sortType || 1,
      },
    },
  ]);

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      customLabels: {
        totalVideos: "totalVideos",
        docs: "videos",
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
    };

    const videos = await Video.aggregatePaginate(pipeline, options);

    if (!videos) {
      return res.status(404).json(new ApiResponse(404, "Videos not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));
  } catch (error) {
    return res.status(500).json("Internal server error in video aggregate");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // console.log(req.files);

  if (!(title && description)) {
    return res
      .status(400)
      .json({ error: "Please provide title and description" });
  }

  const videoFile = req.files?.videoFile[0];
  const thumbnailFile = req.files?.thumbnail[0];

  if (!(videoFile && thumbnailFile)) {
    return res
      .status(400)
      .json({ error: "Please provide video and thumbnail" });
  }

  const videoUrl = videoFile?.path;
  const thumbnailUrl = thumbnailFile?.path;

  const videoPublicId = videoFile?.filename;
  const thumbnailPublicId = thumbnailFile?.filename;

  // Retrieve the uploaded video metadata, including duration
  // const videoMetadata = await cloudinary.api.resource(videoPublicId, {
  //   resource_type: "video",
  // });
  // console.log(videoMetadata);

  // Get the duration of the video
  // const videoDuration = videoMetadata.duration; // Duration is in seconds

  // Convert the duration to hours, minutes, and seconds
  // const hours = Math.floor(videoDuration / 3600);
  // const minutes = Math.floor((videoDuration % 3600) / 60);
  // const seconds = videoDuration % 60;

  const videoPublished = await Video.create({
    title,
    description,
    videoFile: {
      url: videoUrl,
      public_id: videoPublicId,
    },
    thumbnail: {
      url: thumbnailUrl,
      public_id: thumbnailPublicId,
    },
    owner: req.user._id,
  });

  return res.json(
    new ApiResponse(200, videoPublished, "Video published successfully")
  );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Invalid video id" });
  }

  // Fetch video and populate the owner details
  const video = await Video.findById(videoId)
    .populate("owner", "username avatar fullName ")
    .exec();

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  return res.json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { videoId } = req.params;

  // Validate video ID
  if (!isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Invalid video id" });
  }

  // Build the update object
  const updateData = {};

  // Check if title or description is provided
  if (title) updateData.title = title;
  if (description) updateData.description = description;

  // Check for a new thumbnail
  const newThumbnail = req.file?.path;
  const newThumbnailPublicId = req.file?.filename;

  if (newThumbnail) {
    // Fetch the video to delete the old thumbnail
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Delete the old thumbnail from Cloudinary
    await deleteFileFromCloudinary(video.thumbnail.public_id);

    // Add the new thumbnail to the update data
    updateData.thumbnail = {
      url: newThumbnail,
      public_id: newThumbnailPublicId,
    };
  }

  // Update the video with the provided fields using $set
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateData },
    { new: true } // Return the updated document
  );

  if (!updatedVideo) {
    return res.status(404).json({ error: "Video not found" });
  }

  // Return the updated video details
  return res.json(
    new ApiResponse(200, updatedVideo, "Video updated successfully")
  );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Invalid video id" });
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  await deleteFileFromCloudinary(video.videoFile.public_id);
  await deleteFileFromCloudinary(video.thumbnail.public_id);

  await Video.findByIdAndDelete(videoId);

  return res.json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Invalid video id" });
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  video.isPublished = !video.isPublished;

  newVideo = await video.save();

  // console.log(newVideo);

  return res.json(
    new ApiResponse(200, video, "isPublished toggle successfully")
  );
});

const getSubscriberVideos = async (req, res) => {
  // console.log("get subscriber videos called");
  try {
    const userId = req.user._id;

    // console.log("user id", userId);

    const subscriptions = await Subscription.find({
      subscriber: userId,
    }).populate("channel");

    const channelIds = subscriptions.map((sub) => sub.channel);

    const videos = await Video.find({
      owner: { $in: channelIds },
      isPublished: true,
    })
      .populate("owner", "username avatar") // Populate owner details
      .sort({ createdAt: -1 }); // Sort by latest videos

    // Shuffle the videos array
    const shuffledVideos = videos.sort(() => Math.random() - 0.5);

    return res.json(
      new ApiResponse(200, shuffledVideos, "Videos fetched successfully")
    );
  } catch (error) {
    // console.log("error", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const incrementViews = async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } }, // Increment views by 1
      { new: true } // Return the updated document
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res
      .status(200)
      .json(new ApiResponse(200, { views: video.views }, "Views incremented"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating views", error: error.message });
  }
};

// Controller to fetch search suggestions
const getSearchSuggestions = async (req, res) => {
  // console.log(req.query);
  try {
    const { q } = req.query; // Get query parameter

    // Check if query string is empty
    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Query cannot be empty" });
    }

    // Use regex to find matching video titles (case-insensitive)
    const suggestions = await Video.find(
      { title: { $regex: q, $options: "i" } }, // 'i' makes the search case-insensitive
      { title: 1 } // Only return the 'title' field
    ).limit(10); // Limit to 10 suggestions

    // console.log(suggestions);

    // Map to only return titles as an array of strings
    const suggestionTitles = suggestions.map((video) => video.title);

    return res
      .status(200)
      .json(new ApiResponse(200, { suggestions: suggestionTitles }, "OK"));
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getSubscriberVideos,
  incrementViews,
  getSearchSuggestions,
};
