import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace state={{ showToast: true }} />;
  }

  return element;
};

export default ProtectedRoute;
