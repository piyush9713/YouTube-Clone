const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    // console.log(req.cookies?.accessToken);
    // console.log(req.cookies);

    if (!token) {
      throw new ApiError(4001, "Unathorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    res.clearCookies(accessToken).clearCookies(refreshToken);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

module.exports = { verifyJWT };
