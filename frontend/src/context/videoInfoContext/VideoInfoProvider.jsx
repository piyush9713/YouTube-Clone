// import React, { createContext, useReducer } from "react";
// import axios from "axios";
// import { initialState, videoInfoReducer } from "./VideoInfoReducer";
// import { toast } from "sonner";
// const apiUrl = import.meta.env.VITE_API_URL;

// // Create Context
// export const VideoInfoContext = createContext();

// // Provider Component
// export const VideoInfoProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(videoInfoReducer, initialState);

//   // Fetch Video Data
//   const fetchVideoInfoData = async (videoId, channelId) => {
//     dispatch({ type: "LOADING" });
//     try {
//       const likeStatus = await axios.get(
//         `${apiUrl}/v1/likes/status/v/${videoId}`
//       );
//       const subscriptionStatus = await axios.get(
//         `${apiUrl}/v1/subscriptions/status/c/${channelId}`
//       );

//       dispatch({
//         type: "VIDEO_INFO_FETCH_SUCCESS",
//         payload: {
//           likeCount: likeStatus.data.data.likesCount,
//           isLiked: likeStatus.data.data.isLiked,
//           isSubscribed: subscriptionStatus.data.data.isSubscribed,
//         },
//       });
//     } catch (error) {
//       // console.error(error);
//       dispatch({ type: "VIDEO_INFO_FETCH_ERROR", payload: error.message });
//     }
//   };

//   // Toggle Like
//   const toggleLike = async (videoId) => {
//     try {
//       await axios.post(`${apiUrl}/v1/likes/toggle/v/${videoId}`);
//       dispatch({ type: "TOGGLE_LIKE" });
//     } catch (error) {
//       toast.error("Failed to toggle like");
//       console.error(error);
//     }
//   };

//   // Toggle Subscription
//   const toggleSubscription = async (channelId) => {
//     try {
//       await axios.post(`${apiUrl}/v1/subscriptions/c/${channelId}`);
//       dispatch({ type: "TOGGLE_SUBSCRIPTION" });
//     } catch (error) {
//       toast.error("Failed to toggle subscription");
//       console.error(error);
//     }
//   };

//   return (
//     <VideoInfoContext.Provider
//       value={{ ...state, fetchVideoInfoData, toggleLike, toggleSubscription }}>
//       {children}
//     </VideoInfoContext.Provider>
//   );
// };

import React, { createContext, useReducer, useCallback, useMemo } from "react";
import axios from "axios";
import { initialState, videoInfoReducer } from "./VideoInfoReducer";
import { toast } from "sonner";
const apiUrl = import.meta.env.VITE_API_URL;

// Create Context
export const VideoInfoContext = createContext();

// Provider Component
export const VideoInfoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoInfoReducer, initialState);

  // Standardized error handling
  const handleError = (error, errorMessage) => {
    console.error(error);
    toast.error(errorMessage);
  };

  // Fetch Video Data
  const fetchVideoInfoData = useCallback(async (videoId, channelId) => {
    dispatch({ type: "LOADING" });
    try {
      const [likeStatus, subscriptionStatus] = await Promise.all([
        axios.get(`${apiUrl}/v1/likes/status/v/${videoId}`),
        axios.get(`${apiUrl}/v1/subscriptions/status/c/${channelId}`),
      ]);

      dispatch({
        type: "VIDEO_INFO_FETCH_SUCCESS",
        payload: {
          likeCount: likeStatus.data.data.likesCount,
          isLiked: likeStatus.data.data.isLiked,
          isSubscribed: subscriptionStatus.data.data.isSubscribed,
        },
      });
    } catch (error) {
      dispatch({ type: "VIDEO_INFO_FETCH_ERROR", payload: error.message });
    }
  }, []);

  // Toggle Like
  const toggleLike = useCallback(async (videoId) => {
    try {
      await axios.post(`${apiUrl}/v1/likes/toggle/v/${videoId}`);
      dispatch({ type: "TOGGLE_LIKE" });
    } catch (error) {
      handleError(error, "Failed to toggle like");
    }
  }, []);

  // Toggle Subscription
  const toggleSubscription = useCallback(async (channelId) => {
    try {
      await axios.post(`${apiUrl}/v1/subscriptions/c/${channelId}`);
      dispatch({ type: "TOGGLE_SUBSCRIPTION" });
    } catch (error) {
      handleError(error, "Failed to toggle subscription");
    }
  }, []);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      ...state,
      fetchVideoInfoData,
      toggleLike,
      toggleSubscription,
    }),
    [state, fetchVideoInfoData, toggleLike, toggleSubscription]
  );

  return (
    <VideoInfoContext.Provider value={contextValue}>
      {children}
    </VideoInfoContext.Provider>
  );
};
