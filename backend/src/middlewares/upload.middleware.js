const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "uploads";
    let resourceType = "auto";

    if (file.mimetype.startsWith("video")) {
      folder = "video_uploads";
      resourceType = "video";
    } else if (file.mimetype.startsWith("image")) {
      folder = "image_uploads";
      resourceType = "image";
    }
    return {
      folder: folder,
      resource_type: resourceType,
      public_id: file.originalname.split(".")[0],
    };
  },
});

const upload = multer({ storage });

module.exports = { upload };
