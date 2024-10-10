import { createContext, useReducer } from "react";
import axios from "axios";
import { initialState, likedVideosReducer } from "./likedVideosReducer";
const apiUrl = import.meta.env.VITE_API_URL;

export const LikedVideosContext = createContext(initialState);

export const LikedVideosProvider = ({ children }) => {
  const [state, dispatch] = useReducer(likedVideosReducer, initialState);

  // Fetch liked videos
  const fetchLikedVideos = async () => {
    dispatch({ type: "FETCH_LIKED_VIDEOS_START" });
    try {
      const response = await axios.get(`${apiUrl}/v1/likes/videos`);
      dispatch({
        type: "FETCH_LIKED_VIDEOS_SUCCESS",
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({ type: "FETCH_LIKED_VIDEOS_ERROR", payload: error.message });
    }
  };

  return (
    <LikedVideosContext.Provider value={{ ...state, fetchLikedVideos }}>
      {children}
    </LikedVideosContext.Provider>
  );
};
