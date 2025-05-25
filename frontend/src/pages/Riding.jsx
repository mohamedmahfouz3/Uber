import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ride } = location.state || {};

  if (!ride) {
    navigate("/");
    return null;
  }

  return (
    <div className="h-screen relative">
      <div className="absolute top-0 left-0 w-full p-4 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Your Ride</h1>
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
      </div>

      <div className="h-full pt-16">
        <LiveTracking driver={ride.driver} />
      </div>
    </div>
  );
};

export default Riding;
