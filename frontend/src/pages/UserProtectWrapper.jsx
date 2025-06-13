import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // The backend returns the full user object
        if (response.data) {
          setUser(response.data);
          setError(null);
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setError(error.response?.data?.message || "Authentication failed");

        // Clear invalid token
        localStorage.removeItem("token");

        // Handle specific error cases
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          // For other errors, you might want to show an error message
          // or handle them differently
          console.error("Unexpected error:", error);
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
