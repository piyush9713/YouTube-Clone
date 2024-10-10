import { createContext, useReducer, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
const apiUrl = import.meta.env.VITE_API_URL;

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  // user: null,
  isRegistered: false,
};

// Reducer function to manage state updates
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_REGISTERED":
      return { ...state, isRegistered: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/v1/users/current-user`);
  //       const userData = response?.data?.data?.user;
  //       dispatch({ type: "SET_USER", payload: userData });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchUser();
  // });

  const handleApiError = (error, defaultMessage = "An error occurred") => {
    const errorMessage = error?.response?.data?.message || defaultMessage;
    toast.error(errorMessage);
    console.error("API error:", errorMessage);
  };

  const signUp = useCallback(async (data) => {
    try {
      data;
      await axios.post(`${apiUrl}/v1/users/register`, data);
      dispatch({ type: "SET_REGISTERED", payload: true });
      toast.success("User registered successfully.");
    } catch (error) {
      handleApiError(error, "Registration failed");
    }
  }, []);

  const signIn = useCallback(async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/v1/users/login`, data);
      const userData = response?.data?.data?.user;
      dispatch({ type: "SET_USER", payload: userData });
      toast.success("User logged in successfully.");
    } catch (error) {
      console.log(error);
      handleApiError(error, "Login failed");
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await axios.post(`${apiUrl}/v1/users/logout`);
      dispatch({ type: "LOGOUT" });
      toast.success("User logged out successfully.");
    } catch (error) {
      handleApiError(error, "Logout failed");
    }
  }, []);

  const updateProfile = useCallback(async (formData) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/v1/users/update-account`,
        formData
      );
      const userData = response?.data?.data;
      dispatch({ type: "SET_USER", payload: userData });
      toast.success("Profile updated successfully.");
    } catch (error) {
      handleApiError(error, "Update failed");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isRegistered: state.isRegistered,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
