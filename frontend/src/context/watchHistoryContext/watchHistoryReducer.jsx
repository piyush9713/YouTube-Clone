// Initial state
export const initialState = {
  historyVideos: [],
  loading: false,
  error: null,
};

// Reducer function
export const watchHistoryReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_HISTORY_VIDEOS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_HISTORY_VIDEOS_SUCCESS":
      return { ...state, loading: false, historyVideos: action.payload };
    case "FETCH_HISTORY_VIDEOS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
