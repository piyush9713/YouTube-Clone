import { CiBellOn, CiSearch } from "react-icons/ci";
import DarkModeToggle from "../utils/DarkModeToggle";
import Menu from "./Menu";

const RightIcons = ({ isOpen, openSearchBar }) => {
  return (
    <div className={`${isOpen ? "hidden sm:block" : "block"}`}>
      <div className="flex flex-grow items-center gap-2 sm:gap-3">
        <button
          onClick={openSearchBar}
          className="sm:hidden p-2 rounded-full shadow-sm hover:shadow-lg hover:bg-[#F2F2F2] dark:hover:bg-[#272727] cursor-pointer transition-colors duration-200"
          type="button">
          <CiSearch size={"25px"} />
        </button>
        <button className="p-2 rounded-full shadow-sm hover:shadow-lg hover:bg-[#F2F2F2] dark:hover:bg-[#272727] cursor-pointer transition-colors duration-200">
          <CiBellOn size={"25px"} />
        </button>
        <DarkModeToggle />
        <Menu />
      </div>
    </div>
  );
};

export default RightIcons;
