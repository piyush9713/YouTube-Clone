// YourChannelContext.js
import { createContext, useReducer } from "react";
import axios from "axios";
import { initialState, yourChannelReducer } from "./YourChannelReducer";
const apiUrl = import.meta.env.VITE_API_URL;

// Create context
export const YourChannelContext = createContext(initialState);

// Provider
export const YourChannelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(yourChannelReducer, initialState);

  const fetchChannelData = async (username) => {
    dispatch({ type: "FETCH_CHANNEL_DATA_REQUEST" });
    try {
      const userResponse = await axios.get(
        `${apiUrl}/v1/users/channel/${username}`
      );
      const videosResponse = await axios.get(`${apiUrl}/v1/dashboard/videos`);
      dispatch({
        type: "FETCH_CHANNEL_DATA_SUCCESS",
        payload: {
          userData: userResponse.data.data,
          channelVideos: videosResponse.data.data,
        },
      });
    } catch (error) {
      dispatch({ type: "FETCH_CHANNEL_DATA_FAILURE", payload: error.message });
    }
  };

  return (
    <YourChannelContext.Provider value={{ ...state, fetchChannelData }}>
      {children}
    </YourChannelContext.Provider>
  );
};
