// SubscriptionContext.js
import { createContext, useReducer } from "react";
import axios from "axios";
import {
  initialState,
  subscriptionVideoReducer,
} from "./SubscriptionVideoReducer";
const apiUrl = import.meta.env.VITE_API_URL;

// Create the context
export const SubscriptionContext = createContext(initialState);

// Context provider
export const SubscriptionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subscriptionVideoReducer, initialState);

  const fetchSubscriptionVideos = async () => {
    dispatch({ type: "FETCH_SUBSCRIPTION_VIDEOS_REQUEST" });
    try {
      const response = await axios.get(`${apiUrl}/v1/videos/subscribed-videos`);
      const data = response.data.data;
      dispatch({ type: "FETCH_SUBSCRIPTION_VIDEOS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "FETCH_SUBSCRIPTION_VIDEOS_FAILURE",
        payload: error.message,
      });
    }
  };

  return (
    <SubscriptionContext.Provider value={{ ...state, fetchSubscriptionVideos }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
