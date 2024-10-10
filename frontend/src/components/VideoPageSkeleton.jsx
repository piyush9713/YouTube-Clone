const VideoPageSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 animate-pulse">
      {/* Video Section Skeleton */}
      <div className="w-full lg:w-2/3">
        <div
          role="status"
          className="sm:rounded animate-pulse dark:border-gray-700">
          <div className="flex items-center justify-center sm:h-72 h-56  mb-4 bg-gray-300 sm:rounded dark:bg-gray-700"></div>
          <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 mb-4"></div>
          {/* <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div> */}
          <div className="flex items-center mt-4">
            <svg
              className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <div>
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
              <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="h-10 sm:h-20 bg-gray-200 rounded-lg dark:bg-gray-700 w-full my-4"></div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>

      {/* Discussion (Comments) Skeleton */}
      <div className=" lg:w-1/3 w-full  lg:h-[86vh]  border dark:border-gray-800 border-gray-200 rounded-lg">
        <div className="flex flex-col gap-4 p-4 ">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 w-40 mb-2 rounded-md"></div>
          {/* Single comment skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-full mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPageSkeleton;
