import { useCallback, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { InfinitySpin } from "react-loader-spinner";

const Layout = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prevState) => !prevState);
  }, []);

  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return (
      <InfinitySpin
        visible={true}
        width="200"
        color="#4fa94d"
        ariaLabel="infinity-spin-loading"
      />
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-white text-black dark:text-white dark:bg-[#0F0F0F]">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 overflow-hidden relative">
          <div>
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              toggleSidebar={toggleSidebar}
            />
          </div>
          <main className="flex-grow overflow-auto hide-scrollbar z-0 ">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
