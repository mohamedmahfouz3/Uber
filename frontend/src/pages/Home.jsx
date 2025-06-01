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
      <h1 className="text-2xl font-bold mb-4">Welcome to Uber</h1>
      {/* Add your home page content here */}
    </div>
  );
};

export default Home;
