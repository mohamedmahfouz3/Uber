import React, { useEffect, useRef } from "react";
import { RiNavigationLine, RiMapPinLine } from "react-icons/ri";

const LiveTracking = ({ driver, onCancel }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialize map when component mounts
    const initMap = () => {
      if (!mapContainerRef.current) return;

      // This is a placeholder for actual map initialization
      // In a real application, you would use a mapping library like Google Maps, Mapbox, or Leaflet
      // For now, we'll just show a placeholder with the driver's location
      const mapContainer = mapContainerRef.current;
      mapContainer.innerHTML = `
        <div class="w-full h-full bg-gray-100 flex items-center justify-center">
          <div class="text-center">
            <RiMapPinLine class="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p class="text-gray-600">Map will be displayed here</p>
            <p class="text-sm text-gray-500">Driver location: ${
              driver?.location || "Updating..."
            }</p>
          </div>
        </div>
      `;
    };

    initMap();
  }, [driver]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-64 bg-gray-100" />

      {/* Driver Info Panel */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <RiNavigationLine className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium">{driver?.name || "Driver"}</h3>
              <p className="text-sm text-gray-500">
                {driver?.vehicle || "Vehicle"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {driver?.arrivalTime || "Calculating..."}
            </p>
            <p className="text-xs text-gray-500">until arrival</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${driver?.progress || 0}%` }}
          ></div>
        </div>

        {/* Location Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-0.5 h-8 bg-gray-300 mx-auto"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <div className="ml-3 space-y-4">
              <div>
                <p className="font-medium text-gray-900">Pickup</p>
                <p className="text-gray-500">
                  {driver?.pickup || "Loading..."}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Dropoff</p>
                <p className="text-gray-500">
                  {driver?.dropoff || "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => window.open(`tel:${driver?.phone || ""}`)}
            className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            Call Driver
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          >
            Cancel Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
