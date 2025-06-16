import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { UserDataContext } from "../context/UserContext";
import { toast } from "react-toastify";

const LogoutUser = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get("http://localhost:5000/users/logout", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        // Clear local storage and cookies
        localStorage.removeItem("token");
        Cookies.remove("token");

        // Clear user context
        setUser(null);

        toast.success("Logged out successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        navigate("/login");
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
        navigate("/login");
      }
    };

    logout();
  }, [navigate, setUser]);

  // Return null since this is just a utility component
  return null;
};

export default LogoutUser;
