/* eslint-disable react/no-unescaped-entities */
import { useLocation } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import CardLoader from "./CardLoader";
import Card from "./Card";
import { toast } from "sonner";
const apiUrl = import.meta.env.VITE_API_URL;

const VideoResults = () => {
  const { state } = useLocation(); // Get the query from location state
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/v1/videos?query=${state.query}`
        );
        setVideos(response.data.data.videos);
      } catch (error) {
        toast.error("Error fetching videos");
        console.log("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (state?.query) {
      fetchVideos();
    }
  }, [state?.query]);

  return (
    <div>
      <div className=" my-3 mx-4 lg:mx-0 flex sm:items-end flex-col sm:flex-row">
        <p className="text-xl font-medium">Search Results for</p>
        <p className="text-md">"{state.query}"</p>
      </div>
      {isLoading && <Loading />}

      <div className="pt-3 sm:px-4 lg:pl-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-3">
        {videos?.length > 0
          ? videos.map((video) => (
              <Suspense key={video._id} fallback={<CardLoader />}>
                <Card video={video} />
              </Suspense>
            ))
          : ""}
      </div>
    </div>
  );
};

export default VideoResults;
