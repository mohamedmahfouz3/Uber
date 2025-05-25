import React from "react";
import { RiSearchLine } from "react-icons/ri";

const LookingForDriver = ({ onCancel }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="animate-pulse mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
          <RiSearchLine className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Looking for a driver</h2>
      <p className="text-gray-600 mb-6">
        We're searching for the nearest available driver to pick you up
      </p>
      
      <div className="space-y-4">
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
        
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel Search
        </button>
      </div>
    </div>
  );
};

export default LookingForDriver; 