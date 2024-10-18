import React, { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoComment from "../components/VideoComment";
import VideoInfo from "../components/VideoInfo";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import VideoPageSkeleton from "../components/VideoPageSkeleton";
import { VideoDataContext } from "../context/videoDataContext/VideoDataProvider";
const apiUrl = import.meta.env.VITE_API_URL;

const Watch = () => {
  const { videoId } = useParams();
  const { videoData, loading, fetchVideoData } = useContext(VideoDataContext);
  const { user } = useContext(AuthContext);

  const incrementViewCount = useCallback(async () => {
    try {
      await axios.put(`${apiUrl}/v1/videos/views/${videoId}`);
    } catch (error) {
      console.log("Error incrementing view count", error);
    }
  }, [videoId]);

  const WatchHistory = useCallback(async () => {
    try {
      await axios.post(`${apiUrl}/v1/users/save-history/${videoId}`);
    } catch (error) {
      console.log("Error saving watch history", error);
    }
  }, [videoId]);

  useEffect(() => {
    incrementViewCount();
    if (videoId && user) {
      WatchHistory();
    }
  }, [videoId]);

  useEffect(() => {
    fetchVideoData(videoId);
  }, [fetchVideoData, videoId]);

  if (loading) return <VideoPageSkeleton />;

  return (
    <div className="mx-auto sm:p-4 lg:pb-0 pb-4 lg:pl-0">
      <div className="flex flex-col lg:flex-row">
        {/* Main Video Section */}
        <div className="lg:w-2/3 lg:pr-4 lg:h-[86vh] lg:overflow-auto hide-scrollbar">
          <VideoPlayer videoData={videoData} />
          <VideoInfo videoData={videoData} />
        </div>
        {/* Comment Section */}
        <VideoComment videoId={videoId} />
      </div>
    </div>
  );
};

export default Watch;
