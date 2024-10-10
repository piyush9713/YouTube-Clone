const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    avatar: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dgayfe2ln/image/upload/v1727064998/image_uploads/g7jdy8ituxtzon47powc.svg",
        // required: true,
      },

      public_id: {
        type: String,
      },
    },
    coverImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dgayfe2ln/image/upload/v1727065092/image_uploads/mtit9h0pkyeauyu0cklc.jpg",
      },
      public_id: {
        type: String,
      },
    },

    refreshToken: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
