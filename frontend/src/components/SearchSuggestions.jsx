import { useRef } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { suggestions } from "../constants/SuggestionItems";
const SearchSuggestions = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -200 : 200;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative z-30 top-0 bg-white text-black dark:text-white dark:bg-[#0F0F0F] py-3  sm:py-4 sm:mx-4 lg:ml-0 left-0 right-0 px-2 sm:px-0 ">
      {/* Left Arrow - hidden on small screens */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 sm:p-3 rounded-full bg-white text-black dark:text-white dark:bg-[#0F0F0F] hover:bg-[#F2F2F2] shadow-lg cursor-pointer hidden sm:block">
        <SlArrowLeft />
      </button>

      {/* Scrollable Suggestions Container */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 sm:px-10 sm:mx-3 overflow-x-scroll hide-scrollbar"
        style={{ scrollBehavior: "smooth" }}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="whitespace-nowrap text-black dark:text-white bg-[#F2F2F2] hover:bg-[#E5E5E5] dark:bg-[#272727] hover:dark:bg-[#3F3F3F] px-3  right-1 sm:ml-0 py-1 rounded-lg cursor-pointer snap-center transition-colors duration-200">
            {suggestion}
          </button>
        ))}
      </div>

      {/* Right Arrow - hidden on small screens */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white text-black dark:text-white dark:bg-[#0F0F0F] hover:bg-[#F2F2F2] shadow-lg cursor-pointer hidden sm:block">
        <SlArrowRight />
      </button>
    </div>
  );
};

export default SearchSuggestions;
