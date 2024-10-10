import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const LogoSection = ({ toggleSidebar, isOpen }) => {
  const navigate = useNavigate();
  return (
    <div className={`${isOpen ? "hidden sm:block" : "block"}`}>
      <div className="flex justify-center items-center flex-row">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full shadow-sm hover:shadow-lg active:bg-slate-300 hover:bg-[#F2F2F2] dark:hover:bg-[#272727] cursor-pointer transition-all">
          <RxHamburgerMenu size={"24px"} />
        </button>
        <img
          onClick={() => navigate("/")}
          className="w-24 mx-2 sm:mx-4 block dark:hidden"
          src="/youtube-logo-dark.svg"
          alt="logo"
        />
        <img
          onClick={() => navigate("/")}
          className="w-24 mx-2 sm:mx-4 hidden dark:block"
          src="/youtube-logo-light.svg"
          alt="logo"
        />
      </div>
    </div>
  );
};

export default LogoSection;
