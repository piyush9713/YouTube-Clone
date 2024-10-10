import React, { useContext, useEffect } from "react";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6"; // Unfilled thumbs-up icon
import { VideoInfoContext } from "../context/videoInfoContext/VideoInfoProvider";
import { AuthContext } from "../context/AuthContext";
import { format } from "timeago.js";
import { toast } from "sonner";

const VideoInfo = ({ videoData }) => {
  const {
    isLiked,
    likeCount,
    isSubscribed,
    fetchVideoInfoData,
    toggleLike,
    toggleSubscription,
  } = useContext(VideoInfoContext);
  const { user } = useContext(AuthContext);

  const videoId = videoData?._id;
  const channelId = videoData?.owner?._id;

  // Fetch video data on component mount
  useEffect(() => {
    if (videoId && user) {
      fetchVideoInfoData(videoId, channelId);
    }
  }, [videoId, channelId]);

  return (
    <div className="mb-4 mx-4 sm:mx-0 text-black dark:text-white dark:bg-[#0F0F0F] lg:shadow-none">
      <h1 className="text-2xl font-bold">{videoData?.title || "title"}</h1>
      <p>
        {" "}
        {videoData?.views || 0} views • {format(videoData?.createdAt || "")}
      </p>
      <div className="flex items-center justify-between flex-shrink flex-row">
        <div className="flex items-center my-4">
          <button
            type="button"
            className="flex items-center justify-center w-10 mr-3 rounded-full shadow-sm hover:shadow-lg cursor-pointer">
            <img
              className="rounded-full w-10 h-10"
              src={videoData?.owner?.avatar?.url || "/girl.png"}
              alt="User Avatar"
            />
          </button>

          <h1 className="font-bold">
            {videoData?.owner?.username || "xyz9713"}
          </h1>

          <button
            onClick={() => {
              user
                ? toggleSubscription(videoData?.owner?._id)
                : toast.info("Please login to subscribe");
            }}
            className={`border rounded-full px-4 py-1.5 ml-6 font-bold text-white 
                bg-black dark:bg-white dark:text-black
            hover:dark:bg-[#E5E5E5] hover:bg-[#1f1f1f]`}>
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>

        <button
          onClick={() => {
            user ? toggleLike(videoId) : toast.info("Please login to like");
          }}
          className={`flex items-center space-x-2.5 px-4 py-1.5 rounded-full font-bold text-white bg-black dark:bg-white dark:text-black hover:dark:bg-[#E5E5E5] hover:bg-[#1f1f1f]`}>
          {isLiked ? (
            <FaThumbsUp size={20} className="text-base sm:text-xl" />
          ) : (
            <FaRegThumbsUp size={20} className="text-base sm:text-xl hover:" />
          )}
          <span className="text-sm sm:text-base">{likeCount || 0}</span>
        </button>
      </div>
      <p className="mt-2 p-3 rounded-lg bg-[#F2F2F2] dark:bg-[#272727]">
        {videoData?.description || "Video Description"}
      </p>
    </div>
  );
};

export default VideoInfo;
