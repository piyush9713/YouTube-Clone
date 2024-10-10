import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Redirect to the home page if not logged in
    return <Navigate to="/" replace state={{ showToast: true }} />;
  }

  // If logged in, render the protected component
  return element;
};

export default ProtectedRoute;
