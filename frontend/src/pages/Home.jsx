import { useContext, Suspense, lazy, useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchSuggestions from "../components/SearchSuggestions";
import CardLoader from "../components//CardLoader";
import { VideoContext } from "../context/videoContext/VideoProvider";
import Loading from "../components/Loading";
import DotSpinner from "../components/DotSpinner";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const Card = lazy(() => import("../components/Card"));

const Home = () => {
  const { data, fetchVideos, loading } = useContext(VideoContext);
  const { videos, nextPage, hasNextPage } = data;
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showToast) {

      toast.info("Please log in to access this page");
    }
  }, [location]);

  
  const fetchMoreData = useCallback(async () => {
    if (nextPage) {
      // console.log("Fetching more videos", nextPage);
      await fetchVideos(nextPage);
    }
  }, [nextPage, fetchVideos]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <>
      <SearchSuggestions />
      {loading && <Loading />}
      <div
        id="scrollableDiv"
        className="h-[100%] overflow-y-auto hide-scrollbar">
        <InfiniteScroll
          dataLength={videos?.length || 0}
          next={fetchMoreData}
          hasMore={hasNextPage}
          loader={
            <div className="flex justify-center items-center py-4">
              <DotSpinner />
            </div>
          }
          scrollThreshold={0.8}
          endMessage={
            <p className="text-center py-4">
              --------- No more videos ---------
            </p>
          }
          scrollableTarget="scrollableDiv">
          <div className="pt-3 sm:px-4 lg:pl-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
            {videos?.length > 0
              ? videos.map((video) => (
                  <Suspense key={video._id} fallback={<CardLoader />}>
                    <Card video={video} />
                  </Suspense>
                ))
              : ""}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Home;
