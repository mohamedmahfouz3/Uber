import React from "react";
import { RiCarLine, RiUserLine, RiStarFill, RiTimeLine } from "react-icons/ri";

const WaitingForDriver = ({ driver, onCancel }) => {
  if (!driver) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
            <RiUserLine className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{driver.name}</h2>
            <div className="flex items-center text-sm text-gray-600">
              <RiStarFill className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{driver.rating}</span>
              <span className="mx-2">•</span>
              <span>{driver.trips} trips</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <RiCarLine className="h-5 w-5 mr-2" />
          <span>{driver.vehicle}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <RiTimeLine className="h-5 w-5 mr-2" />
            <span>Arriving in</span>
          </div>
          <span className="font-medium">{driver.arrivalTime}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-0.5 h-8 bg-gray-300 mx-auto"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <div className="ml-3 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Pickup</p>
              <p className="text-sm text-gray-500">{driver.pickup}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dropoff</p>
              <p className="text-sm text-gray-500">{driver.dropoff}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onCancel}
        className="w-full mt-6 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
      >
        Cancel Ride
      </button>
    </div>
  );
};

export default WaitingForDriver;
