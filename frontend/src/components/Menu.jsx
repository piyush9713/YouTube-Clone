import React, { useCallback, useContext, useState } from "react";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { MdOutlineSaveAlt, MdUpload } from "react-icons/md";
import SignUp from "../modals/SignUp";
import SignIn from "../modals/SignIn";
import SignOut from "../modals/SignOut";
import UpdateDetails from "../modals/UpdateProfile";
import UploadVideo from "../modals/UploadVideo";
import { BackdropAvatar } from "../utils/BackDrop";
import { AuthContext } from "../context/AuthContext";

const Menu = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Toggle Menu visibility
  const toggleMenu = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        type="button"
        onClick={toggleMenu}
        className="flex items-center border  justify-center w-9 h-9 mx-2 rounded-full shadow-sm hover:shadow-lg cursor-pointer">
        <img
          className="rounded-full z-40"
          src={user?.avatar?.url || "/girl.png"}
          alt=""
        />
      </button>

      {/* Backdrop to close Menu */}
      {isOpen && <BackdropAvatar onClick={toggleMenu} />}

      {/* Menu Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[226px] origin-top-right transition-colors duration-200 bg-white border border-gray-200 rounded-lg shadow-2xlg ring-1 ring-black ring-opacity-5 focus:outline-none z-30 text-black dark:text-white dark:bg-[#0F0F0F] lg:shadow-none px-3 py-2 custom-scrollbar hide-scrollbar max-h-[90vh] overflow-y-scroll">
          {user && (
            <>
              <div className="flex items-center space-x-3 p-2 ">
                <img
                  className="w-9 mb-6 rounded-full"
                  src={user?.avatar?.url || "/girl.png"}
                  alt="User Avatar"
                />
                <div>
                  <h3>{user?.fullName || "Your FullName"}</h3>
                  <h5> @{`${user?.username}` || "@xyz9713"}</h5>
                  <button
                    onClick={() => setSelectedItem(<UpdateDetails />)}
                    className="cursor-pointer text-blue-800 dark:text-blue-500 font-bold">
                    Edit your profile
                  </button>
                </div>
              </div>
              <div
                onClick={() => setSelectedItem(<UploadVideo />) || toggleMenu()}
                className="flex items-center text-center rounded-md hover:bg-[#F2F2F2] dark:hover:bg-[#272727] space-x-6 p-2 px-3 py-3 my-1 cursor-pointer transition-colors duration-200">
                <MdUpload size="24px" />
                <span className="text-md">Upload Video</span>
              </div>
              <div
                onClick={() => setSelectedItem(<SignOut />) || toggleMenu()}
                className="flex items-center text-center rounded-md hover:bg-[#F2F2F2] dark:hover:bg-[#272727] space-x-6 p-2 px-3 py-3 my-1 cursor-pointer transition-colors duration-200">
                <BiLogOut size="24px" />
                <span className="text-md">Sign Out</span>
              </div>
            </>
          )}

          {!user && (
            <>
              <div
                onClick={() => setSelectedItem(<SignUp />) || toggleMenu()}
                className="flex items-center text-center rounded-md hover:bg-[#F2F2F2] dark:hover:bg-[#272727] space-x-6 p-2 px-3 py-3 my-1 cursor-pointer transition-colors duration-200">
                <MdOutlineSaveAlt size="24px" />
                <span className="text-md">Sign Up</span>
              </div>

              <div
                onClick={() => setSelectedItem(<SignIn />) || toggleMenu()}
                className="flex items-center text-center rounded-md hover:bg-[#F2F2F2] dark:hover:bg-[#272727] space-x-6 p-2 px-3 py-3 my-1 cursor-pointer transition-colors duration-200">
                <BiLogIn size="24px" />
                <span className="text-md">Sign In</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Render the selected component */}
      {selectedItem && (
        <div>
          {React.cloneElement(selectedItem, {
            setSelectedItem,
          })}
        </div>
      )}
    </div>
  );
};

export default Menu;
