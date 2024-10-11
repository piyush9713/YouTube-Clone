import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannelStats = async () => {
      try {
        const response = await axios.get(`${apiUrl}/v1/dashboard/stats`);
        setStats(response?.data?.data);
        // toast.success("Channel stats fetched successfully");
      } catch (err) {
        toast.error(err?.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold mt-10 text-pink-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]  p-8 flex flex-col items-center">
      {/* bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 */}
      {/* <h1 className="text-5xl font-extrabold mb-6 text-white drop-shadow-md tracking-wider">
        Funky Dashboard
      </h1> */}
      {/* Free-flowing Flexbox layout */}
      <div className="w-full max-w-6xl flex flex-wrap justify-center gap-6 relative funky-layout">
        <StatCard title="Total Videos" value={stats?.totalVideos || 0} />
        <StatCard title="Total Views" value={stats?.totalViews || 0} />
        <StatCard title="Total Subscribers" value={stats?.subscribers || 0} />
        <StatCard title="Subscribed To" value={stats?.subscribedTo || 0} />
        <StatCard title="Total Likes" value={stats?.totalLikes || 0} />
        <StatCard title="Total Comments" value={stats?.totalComments || 0} />
        <StatCard title="Total Tweets" value={stats?.totalTweets || 0} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  // Applying random rotation and sizes for funky feel
  const randomRotation = Math.floor(Math.random() * 20) - 10; // random rotation between -10deg to 10deg
  const randomScale = Math.random() * (1.2 - 0.8) + 0.8; // random scaling between 0.8x and 1.2x

  return (
    <div
      className="group bg-white rounded-lg p-6 text-center shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
      style={{
        transform: `rotate(${randomRotation}deg) scale(${randomScale})`,
      }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-white  transition-colors duration-300">
        {title}
      </h2>
      <p className="text-5xl font-extrabold text-pink-500 mt-2 group-hover:text-white transition-colors duration-300">
        {value}
      </p>
    </div>
  );
};

export default Dashboard;
