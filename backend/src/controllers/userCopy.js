const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const {
  deleteFileFromCloudinary,
} = require("../utils/deleteFileFromCloudinary");

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  const exitedUser = await User.findOne({
    $or: [{ username }, { email }],
  }).select("-password -refreshToken");

  if (exitedUser) {
    throw new ApiError(400, "User with this username or email already exists");
  }

  const avatarURL = req.files?.avatar[0]?.path;

  if (!avatarURL) {
    throw new ApiError(401, "Avatar file is required");
  }

  const avatarPublicId = req.files?.avatar[0]?.filename;

  let coverImageURL;
  let coverImagePublicId;
  if (req.files?.coverImage) {
    coverImageURL = req.files?.coverImage[0]?.path;
    coverImagePublicId = req.files?.coverImage[0]?.filename;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    password: hashedPassword,
    avatar: {
      url: avatarURL,
      public_id: avatarPublicId,
    },
    coverImage: {
      url: coverImageURL || "",
      public_id: coverImagePublicId || "",
    },
  });

  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  // console.log(createdUser);

  if (!createdUser) {
    throw new ApiError(400, "something went worng while registering the user");
  }

  return res.json({
    status: 201,
    message: "user registered successfully",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Credentials");
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
    "-password -refreshToken"
  );
  // console.log(loggedInUser);

  var options = {
    httpOnly: true,
    secure: true,
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
    throw new ApiError(400, "Invalid Credentials");
  }
  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "Passwords do not match");
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

const updateAccountDetails = asyncHandler(async () => {
  const { username, fullName, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username,
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarURL = req.file?.path;
  const avatarPublicId = req.file?.filename;

  if (!avatarURL) {
    throw new ApiError(401, "Avatar file is missing");
  }

  // Delete old file from cloudinary
  deleteFileFromCloudinary(req.user?.avatar?.public_id);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: {
          url: avatarURL,
          public_id: avatarPublicId,
        },
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageURL = req.file?.path;
  const coverImagePublicId = req.file?.filename;

  if (!coverImageURL) {
    throw new ApiError(401, "coverImage file is missing");
  }

  // Delete old file from cloudinary
  deleteFileFromCloudinary(req.user?.coverImage?.public_id);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: {
          url: coverImageURL || "",
          public_id: coverImagePublicId || "",
        },
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
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
    throw new ApiError(404, "Channel not found");
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

  if (!user || user.length() === 0) {
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
