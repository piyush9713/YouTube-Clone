import { createContext, useCallback, useReducer } from "react";
import axios from "axios";
import { initialState, videoReducer } from "./VideoReducer";
const apiUrl = import.meta.env.VITE_API_URL;

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  const fetchVideos = useCallback(async (page = 1) => {
    dispatch({ type: "FETCH_VIDEOS_START" });
    try {
      const response = await axios.get(`${apiUrl}/v1/videos?page=${page}`);
      console.log(response?.data?.data);
      dispatch({
        type: page === 1 ? "FETCH_VIDEOS_SUCCESS" : "FETCH_MORE_VIDEOS_SUCCESS",
        payload: response?.data?.data,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "FETCH_VIDEOS_ERROR",
        payload: error?.response?.message,
      });
    }
  }, []);

  return (
    <VideoContext.Provider value={{ ...state, fetchVideos }}>
      {children}
    </VideoContext.Provider>
  );
};
