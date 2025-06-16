import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/captainContext";
import { toast } from "react-toastify";
import axios from "axios";

const CaptainHome = () => {
  const { captain } = useContext(CaptainDataContext);
  const [stats, setStats] = useState({
    totalRides: 0,
    totalEarnings: 0,
    onlineHours: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaptainStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/captains/stats",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching captain stats:", error);
        setError(
          error.response?.data?.message || "Failed to load captain statistics"
        );
        toast.error("Failed to load captain statistics", {
          position: "top-center",
          autoClose: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (captain) {
      toast.info(`Welcome back, Captain ${captain.fullName.firstName}!`, {
        position: "top-center",
        autoClose: 3000,
      });
      fetchCaptainStats();
    }
  }, [captain]);

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
          <p className="text-xl font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Captain Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {captain?.fullName.firstName} {captain?.fullName.lastName}
          </p>
        </div>
        <Link
          to="/captain/logout"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </Link>
      </div>

      {/* Vehicle Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Vehicle Type</p>
            <p className="font-medium capitalize">
              {captain?.vehicle.vehicleType}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Vehicle Model</p>
            <p className="font-medium">{captain?.vehicle.vehicleModel}</p>
          </div>
          <div>
            <p className="text-gray-600">Vehicle Number</p>
            <p className="font-medium">{captain?.vehicle.vehicleNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Vehicle Plate</p>
            <p className="font-medium">{captain?.vehicle.vehiclePlate}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Rides</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalRides}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-green-600">
            ₹{stats.totalEarnings.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Online Hours</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.onlineHours.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
            onClick={() => toast.info("Coming soon!")}
          >
            <span className="mr-2">🚗</span>
            Start Driving
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
            onClick={() => toast.info("Coming soon!")}
          >
            <span className="mr-2">📊</span>
            View Earnings Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
