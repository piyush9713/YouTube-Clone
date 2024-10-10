const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const Playlist = require("../models/playlist.model.js");

//TODO: create playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!(name && description)) {
    return res.status(400).json({ error: "Please provide name and description" });
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  return res.json(
    new ApiResponse(201, playlist, "Playlist created successfully")
  );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ error: "User not found" });
  }

  const userPlaylist = Playlist.find({ owner: userId });
  return res.json(
    new ApiResponse(200, userPlaylist, "User playlists fetched successfully")
  );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    return res.status(400).json({ error: "Playlist not found" });
  }
  

  const playlist = Playlist.findById(playlistId);
  return res.json(
    new ApiResponse(200, playlist, "Playlist fetched successfully")
  );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Playlist or video not found" });
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: { video: videoId },
    },
    { new: true }
  );

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  return res.json(
    new ApiResponse(200, playlist, "Video added to playlist successfully")
  );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {
    return res.status(400).json({ error: "Playlist or video not found" });
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: { video: videoId },
    },
    { new: true }
  );

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  return res.json(
    new ApiResponse(200, playlist, "Video removed from playlist successfully")
  );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    return res.status(400).json({ error: "Playlist not found" });
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId);

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });

  }

  return res.json(
    new ApiResponse(200, playlist, "Playlist deleted successfully")
  );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(playlistId)) {
    return res.status(400).json({ error: "Playlist not found" });
  }

  if (!(name && description) && (name && description) === "") {
    return res.status(400).json({ error: "Please provide name or description" });
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      name,
      description,
    },
    { new: true }
  );

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  return res.json(
    new ApiResponse(200, playlist, "Playlist updated successfully")
  );
});

module.exports = {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
