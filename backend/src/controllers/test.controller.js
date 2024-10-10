// test controller
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const cloudinary = require("../utils/cloudinary");

const test = asyncHandler(async (req, res) => {
  // console.log(req.files);

  // console.log("---------- testing successfull -------------");
  return res.status(200).json(new ApiResponse(200, "testing successfull"));
});

module.exports = { test };
