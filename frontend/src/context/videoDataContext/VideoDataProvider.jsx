// src/context/VideoContext.js
import React, { createContext, useReducer, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { initialState, videoDataReducer } from "./VideoDataReducer";
const apiUrl = import.meta.env.VITE_API_URL;

export const VideoDataContext = createContext();

export const VideoDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoDataReducer, initialState);

  const fetchVideoData = useCallback(async (videoId) => {
    dispatch({ type: "FETCH_VIDEO_DATA_START" });
    try {
      const response = await axios.get(`${apiUrl}/v1/videos/${videoId}`);
      dispatch({
        type: "FETCH_VIDEO_DATA_SUCCESS",
        payload: response.data.data,
      });
    } catch (error) {
      toast.error("Failed to load videoData");
      console.error("Error fetching the videoData", error);
      dispatch({
        type: "FETCH_VIDEO_DATA_FAILURE",
        payload: "Failed to load videoData",
      });
    }
  }, []);

  return (
    <VideoDataContext.Provider value={{ ...state, fetchVideoData }}>
      {children}
    </VideoDataContext.Provider>
  );
};
