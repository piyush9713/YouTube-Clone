// src/components/VideoPlayer.js
import React from "react";

const VideoPlayer = ({ videoData }) => {
  const videoUrl = videoData?.videoFile?.url;

  return (
    <div className="w-full h-fit mb-2">
      <video className="w-full h-full sm:rounded-lg" controls>
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;
