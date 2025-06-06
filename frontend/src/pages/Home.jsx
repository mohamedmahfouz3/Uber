import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { toast } from "react-toastify";

const Home = () => {
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (user) {
      toast.info(`Welcome back, ${user.fullName.firstName}!`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [user]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome to Uber</h1>
        <Link
          to="/logout"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </Link>
      </div>
      {/* Add your home page content here */}
    </div>
  );
};

export default Home;
