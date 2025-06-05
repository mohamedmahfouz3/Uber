import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { CaptainDataContext } from "../context/captainContext";
import { toast } from "react-toastify";

const LogoutCaptain = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  useEffect(() => {
    const logout = async () => {
      try {
        // Call the logout endpoint
        await axios.get("http://localhost:5000/captains/logout", {
          withCredentials: true, // Important for cookies
        });

        // Clear local storage and cookies
        localStorage.removeItem("token");
        Cookies.remove("token");

        // Clear captain context
        setCaptain(null);

        // Show success message
        toast.success("Logged out successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Redirect to captain login page
        navigate("/captainLogin");
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Error during logout. Please try again.", {
          position: "top-center",
          autoClose: 5000,
        });
        // Still redirect to login even if there's an error
        navigate("/captainLogin");
      }
    };

    logout();
  }, [navigate, setCaptain]);

  // Return null since this is just a utility component
  return null;
};

export default LogoutCaptain;
