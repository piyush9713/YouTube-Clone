import { useEffect, useState } from "react";
import { IoSunny } from "react-icons/io5";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check the user's theme preference on load
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // Toggle dark mode and save the preference to localStorage
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full shadow-sm hover:shadow-lg hover:bg-[#F2F2F2] dark:hover:bg-[#272727] cursor-pointer transition-colors duration-200">
      {darkMode ? (
        <IoSunny color="white" size={"25px"} />
      ) : (
        <IoSunny size={"25px"} />
      )}
    </button>
  );
};

export default DarkModeToggle;
