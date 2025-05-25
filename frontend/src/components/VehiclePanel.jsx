import React from "react";
import { RiCarLine, RiMotorbikeLine, RiTaxiLine } from "react-icons/ri";

const vehicleTypes = [
  {
    id: "standard",
    name: "Standard",
    icon: RiCarLine,
    description: "Comfortable ride for up to 4 passengers",
    price: "$$",
    time: "5-10 min",
  },
  {
    id: "comfort",
    name: "Comfort",
    icon: RiCarLine,
    description: "Premium ride with extra legroom",
    price: "$$$",
    time: "5-10 min",
  },
  {
    id: "bike",
    name: "Bike",
    icon: RiMotorbikeLine,
    description: "Quick ride for 1 passenger",
    price: "$",
    time: "2-5 min",
  },
  {
    id: "taxi",
    name: "Taxi",
    icon: RiTaxiLine,
    description: "Traditional taxi service",
    price: "$$",
    time: "5-15 min",
  },
];

const VehiclePanel = ({ onVehicleSelect, selectedVehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-4">Choose a ride</h2>
      <div className="space-y-3">
        {vehicleTypes.map((vehicle) => {
          const Icon = vehicle.icon;
          return (
            <button
              key={vehicle.id}
              onClick={() => onVehicleSelect(vehicle)}
              className={`w-full flex items-center p-3 rounded-lg border transition-colors ${
                selectedVehicle?.id === vehicle.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex-shrink-0 mr-4">
                <Icon className="h-8 w-8 text-gray-600" />
              </div>
              <div className="flex-grow text-left">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{vehicle.name}</h3>
                  <span className="text-sm text-gray-500">{vehicle.time}</span>
                </div>
                <p className="text-sm text-gray-500">{vehicle.description}</p>
              </div>
              <div className="ml-4 text-right">
                <span className="text-sm font-medium">{vehicle.price}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VehiclePanel;
