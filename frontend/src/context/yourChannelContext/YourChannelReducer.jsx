// Initial state
export const initialState = {
  userData: null,
  channelVideos: [],
  loading: false,
  error: null,
};

// Reducer function
export const yourChannelReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CHANNEL_DATA_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_CHANNEL_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        userData: action.payload.userData,
        channelVideos: action.payload.channelVideos,
      };
    case "FETCH_CHANNEL_DATA_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
