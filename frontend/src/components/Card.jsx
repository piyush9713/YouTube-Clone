import React from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Card = ({ video }) => {
  return (
    <div className=" sm:rounded-md overflow-hidden shadow-md sm:hover:shadow-slate-700 sm:dark:hover:shadow-white cursor-pointer   transition-colors duration-200 ">
      <Link to={`/watch/${video?._id}`}>
        <LazyLoadImage
          className="w-full aspect-video object-cover "
          src={video?.thumbnail?.url || "default_image.png"} // Dynamic thumbnail
          alt="Video Thumnail"
        />
      </Link>
      <div className="flex item-center p-2">
        <LazyLoadImage
          className="w-9 h-9 rounded-full mt-1"
          src={video?.owner?.avatar?.url || "/girl.png"}
          alt="Avatar"
        />
        <div className="pl-2">
          <h3 className=" font-semibold text-black dark:text-white ">
            {video?.title || "Video Title"}
          </h3>
          <p className="text-black dark:text-white text-sm">
            {video?.owner?.username || "Channel Name"}
            <br />
            {video?.views || 0} views • {format(video?.createdAt) || ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
