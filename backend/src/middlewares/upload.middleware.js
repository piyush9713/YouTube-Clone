const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// Configure Multer-Storage-Cloudinary to handle both videos and images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "uploads"; // Default folder
    let resourceType = "auto"; // Default resource type

    // Set resource type based on the file's mimetype
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
      public_id: file.originalname.split(".")[0], // Save with the original filename
    };
  },
});

// Multer middleware to handle multiple files
const upload = multer({ storage });

module.exports = { upload };
