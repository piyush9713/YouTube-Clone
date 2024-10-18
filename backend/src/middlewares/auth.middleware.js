const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    // console.log(req.cookies?.accessToken);
    // console.log(req.cookies);

    if (!token) {
      return res.status(210).json({ message: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(210).json({ message: "Unathorized User" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.clearCookies(accessToken).clearCookies(refreshToken);
    return res.status(210).json({ message: "Unathorized request" });
  }
});

module.exports = { verifyJWT };
