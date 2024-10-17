const User = require("../models/user.model");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const isValidObjectId = mongoose.isValidObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const {
  deleteFileFromCloudinary,
} = require("../utils/deleteFileFromCloudinary");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const exitedUser = await User.findOne({ email }).select(
    "-password -refreshToken"
  );

  if (exitedUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  const username = email.split("@")[0];
  // console.log(username); // Output: piyush9713

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });

  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  // console.log(createdUser);

  if (!createdUser) {
    return res
      .status(400)
      .json({ message: "something went worng while registering the user" });
  }

  return res.json({
    status: 200,
    message: "user registered successfully",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  // console.log(isPasswordValid);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  user.refreshToken = refreshToken;
  await user.save();

  const loggedInUser = await User.findOne(user._id).select(
    "-password -refreshToken -watchHistory "
  );

  // console.log(loggedInUser);

  var options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );
  // console.log(req.cookies);
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // console.log(req.body);

  const user = await User.findById(req.user._id);
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save({ validateBeforeSave: false });
  return res.json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, fullName } = req.body;

  // console.log(req.body);

  // console.log(req.files);

  let avatarURL = req.user.avatar?.url;
  let avatarPublicId = req.user.avatar?.public_id || "";
  let coverImageURL = req.user.coverImage?.url;
  let coverImagePublicId = req.user.coverImage?.public_id || "";

  // Update avatar if a new file is uploaded
  if (req.files?.avatar) {
    avatarURL = req.files?.avatar[0]?.path;
    avatarPublicId = req.files?.avatar[0]?.filename;

    // Delete old avatar from Cloudinary if a new one is uploaded
    if (req.user?.avatar?.public_id) {
      deleteFileFromCloudinary(req.user.avatar.public_id);
    }
  }

  // Update cover image if a new file is uploaded
  if (req.files?.coverImage) {
    coverImageURL = req.files?.coverImage[0]?.path;
    coverImagePublicId = req.files?.coverImage[0]?.filename;

    // Delete old cover image from Cloudinary if a new one is uploaded
    if (req.user?.coverImage?.public_id) {
      deleteFileFromCloudinary(req.user.coverImage.public_id);
    }
  }

  // Update user information in the database

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          username,
          fullName,
          avatar: {
            url: avatarURL || "",
            public_id: avatarPublicId,
          },
          coverImage: {
            url: coverImageURL || "",
            public_id: coverImagePublicId,
          },
        },
      },
      { new: true }
    ).select("-password -watchHistory -refreshToken");

    // console.log(user);

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    return res.status(400).json({ message: "username is missing" });
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        channelsSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribedTo.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);
  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }
  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Channel fetched successfully"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $match: {
              isPublished: true, // Filter only published videos
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
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "watchHistory fetched successfully"
      )
    );
});

const SaveWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Invalid video id" });
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { watchHistory: videoId },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.watchHistory, "watchHistory saved successfully")
    );
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  // updateUserAvatar,
  // updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  SaveWatchHistory,
};
