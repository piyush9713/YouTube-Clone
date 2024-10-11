import { Suspense, lazy, useContext, useEffect } from "react";
import { WatchHistoryContext } from "../context/watchHistoryContext/WatchHistoryProvider";
import Loading from "../components/Loading";
import CardLoader from "../components/CardLoader";

const Card = lazy(() => import("../components/Card"));

const WatchHistory = () => {
  const { historyVideos, fetchHistoryVideos, loading } =
    useContext(WatchHistoryContext);

  useEffect(() => {
    fetchHistoryVideos();
  }, [fetchHistoryVideos]);

  return (
    <>
      <h1 className="text-3xl font-bold ml-4 lg:ml-0 pt-3 pb-1">
        Watch history
      </h1>
      {loading && <Loading />}
      <div className="pt-3 sm:px-4 lg:pl-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-3">
        {Array.isArray(historyVideos) && historyVideos.length > 0
          ? historyVideos.map((video) => (
              <Suspense key={video._id} fallback={<CardLoader />}>
                <Card video={video} />
              </Suspense>
            ))
          : " You have not watched any videos yet."}
      </div>
    </>
  );
};

export default WatchHistory;
