import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { toast } from "sonner";
import { YourChannelContext } from "../context/yourChannelContext/YourChannelProvider";
import DotSpinner from "../components/DotSpinner";
const apiUrl = import.meta.env.VITE_API_URL;

const UpdateVideo = ({ setSelectedItem, video }) => {
  const [updating, setUpdating] = useState(false);
  const { fetchChannelData } = useContext(YourChannelContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: video?.title,
      description: video?.description,
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("thumbnail", data?.thumbnail[0]);
    formData.append("title", data?.title);
    formData.append("description", data?.description);
    try {
      setUpdating(true);
      await axios.patch(`${apiUrl}/v1/videos/${video?._id}`, formData);
      // console.log(response?.data?.data);
      reset();
      setUpdating(false);
      fetchChannelData();
      toast.success("Video updated successfully");
    } catch (error) {
      setUpdating(false);
      toast.error("Failed to update video. Please try again.");
      console.error("Error updating video:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <main className="w-full h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white shadow-2xl py-6 p-6 rounded-lg text-gray-600 space-y-5">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
              Update Video
            </h3>
            <button
              className={`p-2 rounded-full shadow-sm hover:shadow-lg active:bg-slate-300 hover:bg-[#F2F2F2] cursor-pointer `}
              onClick={() => setSelectedItem(null)}>
              <RxCross1
                size={"24px"}
                className={`${updating ? " cursor-not-allowed" : ""}`}
              />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            encType="multipart/form-data">
            {/* Title */}
            <div className="flex-1 pb-1">
              <label className="block text-gray-700 font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 35,
                    message: "Title must be at least 35 characters long",
                  },
                })}
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${
                  errors.title ? "border-red-500" : "border-slate-200"
                } rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Video Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm pt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex-1 pb-1 pt-2">
              <label className="block text-gray-700 font-bold mb-2">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 20,
                    message: "Description must be at least 20 characters long",
                  },
                })}
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${
                  errors?.description ? "border-red-500" : "border-slate-200"
                } rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Video Description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm pt-1">
                  {errors?.description?.message}
                </p>
              )}
            </div>

            {/* Thumbnail File */}
            <div className="flex-1 pb-1 pt-2">
              <label className="block text-gray-700 font-bold mb-2">
                Thumbnail
              </label>
              <input
                type="file"
                {...register("thumbnail")}
                accept="image/*"
                className={`w-full bg-transparent text-sm border ${
                  errors?.thumbnail ? "border-red-500" : "border-slate-200"
                } rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
              />
              {errors.thumbnail && (
                <p className="text-red-500 text-sm pt-1">
                  {errors?.thumbnail?.message}
                </p>
              )}
            </div>

            {/* Update Button */}
            <div className="text-left mt-6">
              <button
                className={`w-full select-none rounded-lg bg-gray-900 py-3 px-6 text-xs font-bold uppercase text-white shadow-md hover:shadow-lg transition-all ${
                  updating ? " cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={updating}>
                {updating ? (
                  <span className="flex items-center gap-2 justify-center">
                    <DotSpinner />
                    Updating...
                  </span>
                ) : (
                  "Update Video"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateVideo;
