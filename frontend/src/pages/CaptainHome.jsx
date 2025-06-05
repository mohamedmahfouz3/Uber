import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/captainContext";
import { toast } from "react-toastify";

const CaptainHome = () => {
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (captain) {
      toast.info(`Welcome back, Captain ${captain.fullName.firstName}!`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [captain]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Captain Dashboard</h1>
        <Link
          to="/captain-logout"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </Link>
      </div>
      {/* Add captain dashboard content here */}
    </div>
  );
};

export default CaptainHome;
