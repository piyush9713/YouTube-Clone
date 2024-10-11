import { useContext, Suspense, lazy, useEffect } from "react";
import { LikedVideosContext } from "../context/likedVideoContext/likedVideoProvider";
import Loading from "../components/Loading";
import CardLoader from "../components/CardLoader";

// Lazy load the Card component
const Card = lazy(() => import("../components/Card"));

const LikedVideos = () => {
  const { videos, fetchLikedVideos, loading } = useContext(LikedVideosContext);

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold ml-4 lg:ml-0 pt-3 pb-1">
        Liked Videos
      </h1>
      {loading && <Loading />}
      <div className="pt-3 sm:px-4 lg:pl-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-3">
        {Array.isArray(videos) && videos.length > 0
          ? videos.map((video) => (
              <Suspense key={video._id} fallback={<CardLoader />}>
                <Card video={video} />
              </Suspense>
            ))
          : "You have not liked any videos yet."}
      </div>
    </>
  );
};

export default LikedVideos;
