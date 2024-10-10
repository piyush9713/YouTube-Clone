import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignOut = ({ setSelectedItem }) => {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    signOut();
    setSelectedItem(null);
    navigate("/");
    // console.log("User signed out successfully.");
  }, []);

  return null;
};

export default SignOut;
