export const initialState = {
  data: {
    videos: [],
    nextPage: null,
    hasNextPage: false,
  },
  loading: false, // for the initial video fetch
  isFetchingMore: false, // for loading more videos
  error: null,
};

export const videoReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_VIDEOS_START":
      return { ...state, loading: true, error: null, isFetchingMore: false };
    case "FETCH_VIDEOS_SUCCESS":
      return {
        ...state,
        data: {
          videos: action.payload.videos,
          nextPage: action.payload.nextPage,
          hasNextPage: action.payload.hasNextPage,
        },
        loading: false,
        isFetchingMore: false,
        error: null,
      };
    case "FETCH_MORE_VIDEOS_START": // Added for "load more" videos
      return { ...state, isFetchingMore: true, error: null };
    case "FETCH_MORE_VIDEOS_SUCCESS":
      return {
        ...state,
        data: {
          videos: [...state.data.videos, ...action.payload.videos],
          nextPage: action.payload.nextPage,
          hasNextPage: action.payload.hasNextPage,
        },
        isFetchingMore: false, // Keep isFetchingMore false after more videos are fetched
        error: null,
      };
    case "FETCH_VIDEOS_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
        isFetchingMore: false,
      };
    default:
      return state;
  }
};
