// VideoComment.js
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import { CommentContext } from "../context/commentContext/CommentProvider";

const VideoComment = ({ videoId }) => {
  const { register, handleSubmit, reset } = useForm();
  const { state, fetchComments, addComment } = useContext(CommentContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchComments(videoId);
  }, [videoId]);

  const onSubmit = async (data) => {
    {
      user
        ? await addComment(videoId, data?.content)
        : toast.info("Please login to add comment");
    }
    reset();
  };

  return (
    <div className="w-auto mx-4 lg:h-[86vh] sm:mx-0 lg:w-1/3 border dark:border-gray-800 border-gray-200 rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none text-black dark:text-white dark:bg-[#0F0F0F] lg:shadow-none lg:overflow-auto hide-scrollbar custom-scrollbar">
      <section className="h-max rounded-lg antialiased">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg lg:text-2xl font-bold dark:text-white">
              Discussion
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex-1">
              <textarea
                rows="1"
                {...register("content", { required: "Comment is required" })}
                className="w-full text-sm border-b-2 rounded-md p-2 focus:outline-none transition duration-300 ease focus:border-slate-400 hover:border-slate-300 bg-[#F2F2F2] dark:bg-[#272727] "
                placeholder="Add a comment..."></textarea>
            </div>
            <div className="flex justify-end mt-2">
              <button
                className="w-max select-none rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] dark:bg-[rgb(39,39,39)] hover:dark:bg-[#3F3F3F] py-3 px-4 text-xs font-bold uppercase shadow-md hover:shadow-lg transition-colors duration-200"
                type="submit">
                Comment
              </button>
            </div>
          </form>

          <article className="pb-2 text-base rounded-lg ">
            {state.comments.map((comment, index) => (
              <div
                key={comment?._id || index}
                className="mt-3 p-2 rounded-lg bg-[#F2F2F2] dark:bg-[#272727] ">
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm font-semibold">
                      <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src={
                          comment?.owner?.avatar?.url ||
                          "https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                        }
                        alt="User"
                      />
                      {comment?.owner?.username || "Anonymous"}
                    </p>
                  </div>
                </footer>
                <p>{comment.content}</p>
              </div>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
};

export default VideoComment;
