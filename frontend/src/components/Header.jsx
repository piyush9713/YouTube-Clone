import { useState } from "react";
import LogoSection from "./LogoSection";
import RightIcons from "./RightIcons";
import SearchBar from "./SearchBar";

const Header = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSearchBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="flex items-center justify-between bg-white text-black dark:text-white dark:bg-[#0F0F0F] sm:px-5 sm:p-2 py-2 px-2 top-0">
      {/* Left: YouTube Logo */}
      <LogoSection toggleSidebar={toggleSidebar} isOpen={isOpen} />

      {/* Center: Search Bar */}
      <SearchBar isOpen={isOpen} openSearchBar={openSearchBar} />

      {/* Right: Icons */}
      <RightIcons isOpen={isOpen} openSearchBar={openSearchBar} />
    </header>
  );
};

export default Header;
