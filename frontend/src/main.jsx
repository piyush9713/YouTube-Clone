import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// In your main file (e.g., index.js or main.jsx)
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://youtube-clone-ud9z.onrender.com",
  withCredentials: true, // Automatically includes credentials (cookies) in every request
});

// Now use axiosInstance for all your API calls
axiosInstance
  .get("/protected-route")
  .then((response) => console.log(response))
  .catch((error) => console.log(error));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App className="scroll-smooth font-roboto" />
  </StrictMode>
);
