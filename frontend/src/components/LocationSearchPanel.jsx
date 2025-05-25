import React, { useState } from "react";
import { RiSearchLine, RiMapPinLine } from "react-icons/ri";

const LocationSearchPanel = ({ onLocationSelect }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pickup && dropoff) {
      onLocationSelect({ pickup, dropoff });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Pickup Location */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiMapPinLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup location"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Dropoff Location */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiMapPinLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Enter dropoff location"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RiSearchLine className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationSearchPanel;
