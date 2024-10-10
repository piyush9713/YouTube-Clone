// Initial State
export const initialState = {
  loading: false,
  error: null,
  isLiked: false,
  likeCount: 0,
  isSubscribed: false,
};

// Reducer
export const videoInfoReducer = (state, action) => {
  switch (action.type) {
    case "VIDEO_INFO_FETCH_SUCCESS":
      return {
        ...state,
        likeCount: action.payload.likeCount,
        isLiked: action.payload.isLiked,
        isSubscribed: action.payload.isSubscribed,
        loading: false,
        error: null,
      };
    case "VIDEO_INFO_FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "TOGGLE_LIKE":
      return {
        ...state,
        isLiked: !state.isLiked,
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
      };
    case "TOGGLE_SUBSCRIPTION":
      return { ...state, isSubscribed: !state.isSubscribed };
    default:
      return state;
  }
};
