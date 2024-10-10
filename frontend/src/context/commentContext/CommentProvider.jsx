// CommentContext.js
import React, { createContext, useReducer } from "react";
import axios from "axios";
import { toast } from "sonner";
import { commentReducer, initialState } from "./CommentReducer";
const apiUrl = import.meta.env.VITE_API_URL;

export const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, initialState);

  const fetchComments = async (videoId) => {
    dispatch({ type: "FETCH_COMMENTS_REQUEST" });
    try {
      const response = await axios.get(`${apiUrl}/v1/comments/${videoId}`);
      const fetchedComments = response?.data?.data || [];
      dispatch({ type: "FETCH_COMMENTS_SUCCESS", payload: fetchedComments });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load comments.");
      dispatch({ type: "FETCH_COMMENTS_FAILURE", payload: error });
    }
  };

  const addComment = async (videoId, content) => {
    if (!content || content.trim() === "") {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/v1/comments/${videoId}`, {
        content,
      });
      const newComment = response?.data?.data;
      dispatch({ type: "ADD_COMMENT", payload: newComment });
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment.");
    }
  };

  return (
    <CommentContext.Provider value={{ state, fetchComments, addComment }}>
      {children}
    </CommentContext.Provider>
  );
};
