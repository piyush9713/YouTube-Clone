import { useEffect, lazy, Suspense, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Assuming AuthContext provides the user info
import { YourChannelContext } from "../context/yourChannelContext/YourChannelProvider";
import Loading from "../components/Loading";
import CardLoader from "../components/CardLoader";

// Lazy load components
const ChannelCard = lazy(() => import("../components/ChannelCard"));

const YourChannel = () => {
  const { user } = useContext(AuthContext);
  const { userData, channelVideos, fetchChannelData, loading } =
    useContext(YourChannelContext);

  useEffect(() => {
    if (user) {
      fetchChannelData(user?.username);
    }
  }, []);

  return (
    <div className="px-4 py-3 lg:pl-0">
      <div className="bg-[#F2F2F2] dark:bg-[#272727] text-black dark:text-white rounded-lg p-6 flex items-center">
        <img
          src={userData?.avatar?.url || "/girl.png"}
          alt={`${userData?.username}'s avatar`}
          className="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold ">
            {userData?.fullName || "Your Name"}
          </h1>
          <p>@{userData?.username || "username"}</p>
          <div className="flex gap-3">
            <p>{userData?.subscribersCount || 0} Subscribers</p>
            <p>{userData?.channelsSubscribedToCount || 0} Subscribed</p>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-6">Uploaded Videos</h2>
      {loading && <Loading />}
      {/* <div className="py-4 lg:pl-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"> */}
      <div className="pt-3 sm:px-4 lg:pl-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-3">
        {Array.isArray(channelVideos) && channelVideos.length > 0
          ? channelVideos.map((video) => (
              <Suspense key={video._id} fallback={<CardLoader />}>
                <ChannelCard video={video} />
              </Suspense>
            ))
          : " You have not uploaded any videos yet."}
      </div>
    </div>
  );
};

export default YourChannel;
