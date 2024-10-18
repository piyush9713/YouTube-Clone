import { BiLike } from "react-icons/bi";
import { GoHistory, GoHome } from "react-icons/go";
import { LuAtom, LuUserSquare2 } from "react-icons/lu";
import { MdOutlineSubscriptions } from "react-icons/md";
import { RxCross1, RxDashboard } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { BackdropSidebar } from "../utils/BackDrop";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const username = user?.username || null;
  const navigate = useNavigate();

  const handleClick = (link) => {
    if (link === "/") {
      navigate(link);
      return;
    }

    // Check login status for other routes
    if (!user) {
      toast.info("Please log in to access this page...");
    } else {
      navigate(link);
    }
  };

  const SidebarItem = [
    {
      icon: <GoHome size="24px" />,
      title: "Home",
      link: "/",
    },
    {
      icon: <MdOutlineSubscriptions size="24px" />,
      title: "Subscription",
      link: "/subscription",
    },
    {
      icon: <LuUserSquare2 size="24px" />,
      title: "Your Channel",
      link: `/channel/${username}`,
    },
    {
      icon: <GoHistory size="24px" />,
      title: "History",
      link: "/history",
    },
    {
      icon: <BiLike size="24px" />,
      title: "Liked Videos",
      link: "/liked-videos",
    },
    {
      icon: <RxDashboard size="24px" />,
      title: "Dashboard",
      link: "/dashboard",
    },
    // {
    //   icon: <LuAtom size="24px" />,
    //   title: "Demo",
    //   link: "/demo",
    // },
  ];

  return (
    <>
      <nav
        className={`
          fixed lg:static z-20 top-0 left-0 h-lvh lg:transition-none transition-all bg-white text-black dark:text-white dark:bg-[#0F0F0F] shadow-2xl lg:shadow-none px-4 cursor-pointer w-56
          ${isCollapsed ? "block lg:w-20 " : "hidden lg:block"}`}>
        {/* Close button inside sidebar (for mobile screens only) */}
        <div className="flex justify-between flex-row lg:hidden mb-2 py-2">
          <img
            className="w-24 mx-2 sm:mx-4 block dark:hidden"
            src="/youtube-logo-dark.svg"
            alt="logo"
          />
          <img
            className="w-24 mx-2 sm:mx-4 hidden dark:block"
            src="/youtube-logo-light.svg"
            alt="logo"
          />
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full shadow-sm hover:shadow-lg active:bg-slate-300 hover:bg-[#F2F2F2] dark:hover:bg-[#272727] cursor-pointer">
            <RxCross1 size={"24px"} />
          </button>
        </div>
        {/* Sidebar items */}
        {SidebarItem.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(item.link)}
            className={`
              flex items-center text-center rounded-md hover:bg-[#F2F2F2] dark:hover:bg-[#272727] space-x-6 p-2 px-3 py-3 my-1 cursor-pointer transition-colors duration-200
            `}>
            {item.icon}
            <span
              className={`text-md ${
                isCollapsed ? "block lg:hidden" : "hidden lg:block"
              }`}>
              {item.title}
            </span>
          </div>
        ))}
      </nav>
      {isCollapsed && <BackdropSidebar onClick={toggleSidebar} />}
    </>
  );
};

export default Sidebar;
