import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5"; // Import a search icon
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "sonner";
const apiUrl = import.meta.env.VITE_API_URL;

const SearchBar = ({ isOpen, openSearchBar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false); // Track input focus
  const navigate = useNavigate(); // Initialize navigate
  const debounceDelay = 300;

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    try {
      const suggestionResponse = await axios.get(
        `${apiUrl}/v1/videos/search/suggestions?q=${query}`
      );
      setSuggestions(suggestionResponse.data.data.suggestions);
    } catch (error) {
      toast.error("Error fetching suggestions", error);
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (query) => {
    const searchValue = query || searchQuery; // Use query if provided
    if (searchValue !== "") {
      navigate(`/search`, { state: { query: searchValue } });
      setSuggestions([]); // Clear suggestions
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.getElementById("searchInput").focus(); // Auto-focus on small screens
    }
  }, [isOpen]);

  return (
    <div
      className={`${
        isOpen ? "flex w-[100%]" : "hidden"
      } sm:flex sm:w-[50%] flex-shrink flex-row items-center justify-between relative sm:ml-5 sm:mx-3`}>
      {/* Close button for mobile */}
      <button
        onClick={() => {
          openSearchBar();
          setSearchQuery("");
        }}
        className="sm:hidden rounded-l-md text-center cursor-pointer absolute right-5 z-10"
        type="button">
        <RxCross2 size={"25px"} />
      </button>

      {/* Input container */}
      <div className="relative w-full">
        <input
          id="searchInput"
          type="text"
          autoComplete="off"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress} // Handle search on "Enter" press
          onFocus={() => setInputFocused(true)} // Show left icon on focus
          onBlur={() => setInputFocused(false)} // Hide left icon when not focused
          placeholder="Search..."
          className={`w-full dark:bg-[#121212] placeholder:text-slate-400 text-md border border-[#CCCCCC] dark:border-[#222222] bg[#222222] py-2 ease focus:outline-none dark:focus:border-[#1B5DAF] dark:hover:border-slate-600 focus:border-[#1B5DAF] hover:border-slate-300 shadow-sm focus:shadow dark:text-white transition-colors duration-200 ${
            inputFocused ? "pl-11" : "pl-4"
          } rounded-full`} // Adjust padding and rounding corners based on focus
        />

        {/* Left search icon, visible only when input is focused */}
        {inputFocused && (
          <IoSearchOutline
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          />
        )}

        {/* Right search icon with background color */}
        {/* <div className="w-16 h-[42px] absolute -right-0.5 top-1/2 transform -translate-y-1/2 cursor-pointer rounded-r-full dark:bg-[#222222] flex items-center justify-center bg-[#F0F0F0] border border-[#CCCCCC] dark:border-[#222222]">
          <IoSearchOutline
            size={26}
            className="hidden sm:block"
            onClick={() => handleSearchSubmit()}
          />
        </div> */}
        <div className="w-16 h-[42px] absolute -right-0.5 top-1/2 transform -translate-y-1/2 cursor-pointer rounded-r-full dark:bg-[#222222] flex items-center justify-center bg-[#F0F0F0] border border-[#CCCCCC] dark:border-[#222222]">
          <IoSearchOutline
            size={26}
            className="hidden sm:block"
            onClick={() => handleSearchSubmit()} // No event object passed, just trigger the function
          />
        </div>
      </div>

      {/* Render suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute w-full left-0 top-full bg-white text-black dark:text-white dark:bg-[#0F0F0F] border border-slate-200 dark:border-slate-700 rounded-md z-50 shadow-2xl max-h-96 overflow-y-auto py-2 mt-2 ">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-[#F2F2F2] dark:hover:bg-[#272727] cursor-pointer"
              onClick={() => handleSearchSubmit(suggestion)} // Search on suggestion click
            >
              <div className="flex items-center">
                <IoSearchOutline
                  size={20}
                  className="ml-1 mr-3 overflow-hidden"
                />
                {suggestion}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
