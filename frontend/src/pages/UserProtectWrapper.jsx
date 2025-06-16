import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyAndLoadUser = async () => {
      if (!token) {
        setError("No authentication token found");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/users/profile",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          setUser(response.data);
          setError(null);
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        const message =
          error.response?.data?.message || "Authentication failed";
        setError(message);

        // Clear invalid token
        localStorage.removeItem("token");
        Cookies.remove("token");

        // Handle specific error cases
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Unexpected error:", error);
          toast.error(message, {
            position: "top-center",
            autoClose: 5000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndLoadUser();
  }, [token, navigate, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Authentication Error</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
