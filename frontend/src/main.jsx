import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// In your main file (e.g., index.js or main.jsx)
import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App className="scroll-smooth font-roboto" />
  </StrictMode>
);
