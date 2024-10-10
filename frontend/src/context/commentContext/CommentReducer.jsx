export const initialState = {
  comments: [],
  loading: false,
  error: null,
};

export const commentReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_COMMENTS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_COMMENTS_SUCCESS":
      return { ...state, loading: false, comments: action.payload };
    case "FETCH_COMMENTS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "ADD_COMMENT":
      return { ...state, comments: [action.payload, ...state.comments] };
    default:
      return state;
  }
};
