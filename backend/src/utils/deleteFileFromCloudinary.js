const cloudinary = require("../utils/cloudinary");

const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted successfully:", result);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

module.exports = { deleteFileFromCloudinary };
