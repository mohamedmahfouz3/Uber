import React from "react";
import { RiMapPinLine, RiTimeLine, RiMoneyDollarCircleLine } from "react-icons/ri";

const ConfirmRide = ({ locations, selectedVehicle, onConfirm }) => {
  if (!locations || !selectedVehicle) return null;

  const { pickup, dropoff } = locations;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-4">Confirm your ride</h2>
      
      {/* Location Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-0.5 h-8 bg-gray-300 mx-auto"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <div className="ml-3 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Pickup</p>
              <p className="text-sm text-gray-500">{pickup}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dropoff</p>
              <p className="text-sm text-gray-500">{dropoff}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex items-center text-sm">
          <RiTimeLine className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">Estimated arrival time: {selectedVehicle.time}</span>
        </div>
        <div className="flex items-center text-sm">
          <RiMoneyDollarCircleLine className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">Price range: {selectedVehicle.price}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className="w-full mt-6 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Confirm Ride
      </button>
    </div>
  );
};

export default ConfirmRide; 