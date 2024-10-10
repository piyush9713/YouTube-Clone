// Initial state
export const initialState = {
  subscriptionVideos: [],
  loading: false,
  error: null,
};

// Reducer function
export const subscriptionVideoReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUBSCRIPTION_VIDEOS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SUBSCRIPTION_VIDEOS_SUCCESS":
      return { ...state, loading: false, subscriptionVideos: action.payload };
    case "FETCH_SUBSCRIPTION_VIDEOS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
