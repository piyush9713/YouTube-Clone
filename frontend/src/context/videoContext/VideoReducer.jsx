export const initialState = {
  data: {
    videos: [],
    nextPage: null,
    hasNextPage: false,
  },
  loading: false,
  error: null,
};

export const videoReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_VIDEOS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_VIDEOS_SUCCESS":
      return {
        ...state,
        data: {
          videos: action.payload.videos,
          nextPage: action.payload.nextPage,
          hasNextPage: action.payload.hasNextPage,
        },
        loading: false,
        error: null,
      };
    case "FETCH_MORE_VIDEOS_SUCCESS":
      return {
        ...state,
        data: {
          videos: [...state.data.videos, ...action.payload.videos],
          nextPage: action.payload.nextPage,
          hasNextPage: action.payload.hasNextPage,
        },
        loading: false,
        error: null,
      };

    case "FETCH_VIDEOS_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
