export const initialState = {
  videos: [],
  loading: false,
  error: null,
};

export const likedVideosReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_LIKED_VIDEOS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_LIKED_VIDEOS_SUCCESS":
      return { ...state, videos: action.payload, loading: false, error: null };
    case "FETCH_LIKED_VIDEOS_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
