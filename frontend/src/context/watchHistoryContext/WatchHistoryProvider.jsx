// WatchHistoryContext.js
import { createContext, useCallback, useReducer } from "react";
import axios from "axios";
import { initialState, watchHistoryReducer } from "./watchHistoryReducer";
const apiUrl = import.meta.env.VITE_API_URL;

// Create the context
export const WatchHistoryContext = createContext(initialState);

// Context provider
export const WatchHistoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(watchHistoryReducer, initialState);

  const fetchHistoryVideos = useCallback(async () => {
    dispatch({ type: "FETCH_HISTORY_VIDEOS_REQUEST" });
    try {
      const response = await axios.get(`${apiUrl}/v1/users/history`);
      const data = response.data.data;
      dispatch({ type: "FETCH_HISTORY_VIDEOS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "FETCH_HISTORY_VIDEOS_FAILURE",
        payload: error.message,
      });
    }
  }, []);

  return (
    <WatchHistoryContext.Provider value={{ ...state, fetchHistoryVideos }}>
      {children}
    </WatchHistoryContext.Provider>
  );
};
