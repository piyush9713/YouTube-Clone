// Initial state for video
export const initialState = {
  videoData: null,
  loading: false,
  error: null,
};

// Reducer function to handle different states
export const videoDataReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_VIDEO_DATA_START":
      return { ...state, loading: true, error: null };
    case "FETCH_VIDEO_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        videoData: action.payload,
        error: null,
      };
    case "FETCH_VIDEO_DATA_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
