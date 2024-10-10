import React from "react";
import CardLoader from "./CardLoader";

const Loading = () => {
  return (
    <div className="pt-3 sm:px-4 lg:pl-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <CardLoader key={index} />
      ))}
    </div>
  );
};

export default Loading;
