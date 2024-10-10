import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import WatchHistory from "./pages/WatchHistory";
import LikedVideos from "./pages/LikedVideos";
import Subscription from "./pages/Subscription";
import Watch from "./pages/Watch";
import YourChannel from "./pages/YourChannel";
import ContextProvider from "./context/ContextProvider";
import { Toaster } from "sonner";

import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import VideoResults from "./components/VideoResults";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/watch/:videoId",
        element: <Watch />,
      },
      {
        path: "/search",
        element: <VideoResults />,
      },
      {
        path: "/subscription",
        element: <ProtectedRoute element={<Subscription />} />,
      },
      {
        path: `/channel/:username`,
        element: <ProtectedRoute element={<YourChannel />} />,
      },
      {
        path: "/history",
        element: <ProtectedRoute element={<WatchHistory />} />,
      },
      {
        path: "/liked-videos",
        element: <ProtectedRoute element={<LikedVideos />} />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

const App = () => {
  return (
    <>
      <ContextProvider>
        <Toaster richColors position="top-center" duration={2000} />
        <RouterProvider router={router} />
      </ContextProvider>
    </>
  );
};

export default App;
