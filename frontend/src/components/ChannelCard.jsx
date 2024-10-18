import axios from "axios";
import React, { useContext, useState } from "react";
import { GoTrash } from "react-icons/go";
import { LiaEditSolid } from "react-icons/lia";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { toast } from "sonner";
import UpdateVideo from "../modals/UpdateVideo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { YourChannelContext } from "../context/yourChannelContext/YourChannelProvider";
import DotSpinner from "./DotSpinner";
const apiUrl = import.meta.env.VITE_API_URL;

const ChannelCard = ({ video }) => {
  const [published, setPublished] = useState(video.isPublished);
  const [selectedItem, setSelectedItem] = useState(null);
  const { fetchChannelData } = useContext(YourChannelContext);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleTogglePublish = async () => {
    try {
      await axios.patch(`${apiUrl}/v1/videos/toggle/publish/${video._id}`);
      setPublished((prev) => !prev);
      toast.success("Published status toggled successfully");
    } catch (error) {
      toast.error("Failed to toggle publish status");
      console.log("Error toggling publish status:", error);
    }
  };

  const handleUpdate = () => {
    setSelectedItem(
      <UpdateVideo video={video} setSelectedItem={setSelectedItem} />
    );
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${apiUrl}/v1/videos/${video._id}`);

      toast.success("Video deleted successfully");
      fetchChannelData();
      setDeleteLoading(false);
    } catch (error) {
      toast.error("Failed to delete video", error);
      console.log("Error deleting video:", error);
    }
  };

  return (
    <>
      <div className=" rounded-md overflow-hidden shadow-md hover:shadow-slate-700 dark:hover:shadow-white cursor-pointer transition-colors duration-200  ">
        <Link to={`/watch/${video?._id}`}>
          <LazyLoadImage
            className="w-full aspect-video object-cover "
            src={video?.thumbnail?.url || "default_image.png"}
            alt="Video Thumnail"
          />
        </Link>
        <div className="flex item-center p-2">
          <LazyLoadImage
            className="w-9 h-9 rounded-full mt-1"
            src={video?.owner?.avatar?.url || "/girl.png"}
            alt="Avatar"
          />
          <div className="pl-2 pt-1">
            <h3 className=" font-semibold text-black dark:text-white ">
              {video?.title || "Video Title"}
            </h3>
            <p className="text-black dark:text-white text-sm ">
              {video?.owner?.username || "Description"}
              <br />
              {video?.views || 0} views • {format(video?.createdAt) || ""}
            </p>
          </div>
        </div>
        <hr />
        {/* Action Buttons with Icons */}
        <div className="flex items-center justify-center gap-8 p-1.5">
          <button
            onClick={handleUpdate}
            className="p-2 rounded-md  hover:bg-[#E5E5E5]  hover:dark:bg-[#3F3F3F]  shadow-md hover:shadow-lg transition-colors duration-200"
            aria-label="Update video">
            <LiaEditSolid size={22} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-md  hover:bg-[#E5E5E5]  hover:dark:bg-[#3F3F3F]  shadow-md hover:shadow-lg transition-colors duration-200"
            aria-label="Delete video">
            {deleteLoading ? <DotSpinner /> : <GoTrash size={22} />}
          </button>
          <button
            onClick={handleTogglePublish}
            className="p-2 rounded-md  hover:bg-[#E5E5E5]  hover:dark:bg-[#3F3F3F]  shadow-md hover:shadow-lg transition-colors duration-200"
            aria-label={published ? "Unpublish video" : "Publish video"}>
            {published ? (
              <IoEyeOffOutline size={22} />
            ) : (
              <IoEyeOutline size={22} />
            )}
          </button>
        </div>
      </div>
      {selectedItem && (
        <div>
          {React.cloneElement(selectedItem, {
            setSelectedItem,
          })}
        </div>
      )}
    </>
  );
};

export default ChannelCard;
