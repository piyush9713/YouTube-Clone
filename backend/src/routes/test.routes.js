const { verifyJWT } = require("../middlewares/auth.middleware");
const { test } = require("../controllers/test.controller");
const router = require("express").Router();
const { upload } = require("../middlewares/upload.middleware");

//test route
router.route("/upload").post(
  upload.fields([
    // { name: "avatar", maxCount: 1 },
    // { name: "gallery", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
    // { name: "thumbnail", maxCount: 1 },
  ]),
  test
);

module.exports = router;
