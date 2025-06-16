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
        await axios.get("http://localhost:5000/captains/logout", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
            "Content-Type": "application/json",
          },
        });

        // Clear local storage and cookies
        localStorage.removeItem("captainToken");
        Cookies.remove("captainToken");

        // Clear captain context
        setCaptain(null);

        toast.success("Logged out successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        navigate("/captain/login");
      } catch (error) {
        console.error("Logout error:", error);
        const message =
          error.response?.data?.message ||
          "Error during logout. Please try again.";
        toast.error(message, {
          position: "top-center",
          autoClose: 5000,
        });
        // Still redirect to login even if there's an error
        navigate("/captain/login");
      }
    };

    logout();
  }, [navigate, setCaptain]);

  // Return null since this is just a utility component
  return null;
};

export default LogoutCaptain;
