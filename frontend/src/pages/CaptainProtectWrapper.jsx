import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/captainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("captainToken");
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyAndLoadCaptain = async () => {
      if (!token) {
        setError("No authentication token found");
        navigate("/captain/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/captains/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // The backend returns the captain data in response.data.captain
        if (response.data?.captain) {
          setCaptain(response.data.captain);
          setError(null);
        } else {
          throw new Error("Invalid captain data received");
        }
      } catch (error) {
        console.error("Captain authentication error:", error);
        setError(error.response?.data?.message || "Authentication failed");

        // Clear invalid token
        localStorage.removeItem("captainToken");

        // Handle specific error cases
        if (error.response?.status === 401) {
          navigate("/captain/login");
        } else {
          // For other errors, you might want to show an error message
          // or handle them differently
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndLoadCaptain();
  }, [token, navigate, setCaptain]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Captain Authentication Error</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => navigate("/captain/login")}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Go to Captain Login
          </button>
        </div>
      </div>
    );
  }

  if (!captain) {
    return null;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
