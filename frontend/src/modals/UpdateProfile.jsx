import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import { AuthContext } from "../context/AuthContext";
import DotSpinner from "../components/DotSpinner";

const UpdateProfile = ({ setSelectedItem }) => {
  const { user, updateProfile } = useContext(AuthContext);
  const [updating, setUpdating] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      fullName: user?.fullName || "",
      avatar: user?.avatar || "",
      coverImage: user?.coverImage || "",
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);
    formData.append("coverImage", data.coverImage[0]);
    formData.append("usename", data.username);
    formData.append("fullName", data.fullName);

    try {
      setUpdating(true);
      await updateProfile(formData);
      reset();
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      console.log("Error updating profile:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <main className="w-full h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white shadow-2xl py-6 p-6 rounded-lg text-gray-600 space-y-5">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
              Update Profile
            </h3>
            <button
              className={` p-2 rounded-full shadow-sm hover:shadow-lg active:bg-slate-300 hover:bg-[#F2F2F2] cursor-pointer`}
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
            {/* Email */}
            <div className="flex-1 pb-1">
              <label className="block text-gray-700 font-bold mb-1">
                Email
              </label>
              <input
                type="email"
                disabled
                {...register("email")}
                className={`w-full bg-slate-100 placeholder:text-slate-400 text-slate-700 text-sm border  rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Email"
              />
            </div>

            {/* Username */}
            <div className="flex-1 pb-1 pt-2">
              <label className="block text-gray-700 font-bold mb-1">
                User Name
              </label>
              <input
                type="text"
                disabled
                {...register("username")}
                className={`w-full bg-slate-100 placeholder:text-slate-400 text-slate-700 text-sm border rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="User Name"
              />
            </div>

            {/* Full Name */}
            <div className="flex-1 pb-1 pt-2">
              <label className="block text-gray-700 font-bold mb-1 ">
                Full Name
              </label>
              <input
                {...register("fullName", {
                  required: "Full Name is required",
                })}
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Full Name"
              />
            </div>

            {/* Avatar File */}
            <div className="flex-1 pb-1 pt-2">
              <label className="block text-gray-700 font-bold mb-1 ">
                Aavtar
              </label>
              <input
                type="file"
                {...register("avatar")}
                accept="image/*"
                className={`w-full bg-transparent text-sm border  rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
              />
            </div>

            {/* Cover Image */}
            <div className="flex-1 pb-1 pt-2">
              <label className="block text-gray-700 font-bold mb-1">
                Cover Image
              </label>
              <input
                type="file"
                {...register("coverImage")}
                accept="image/*"
                className={`w-full bg-transparent text-sm border  rounded-md px-3 py-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
              />
            </div>

            {/* Upload Button */}
            <div className="text-left mt-4">
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
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateProfile;
