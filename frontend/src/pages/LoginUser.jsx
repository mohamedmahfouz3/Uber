import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // Make API request to login endpoint
      const response = await axios.post(
        "http://localhost:5000/users/login", // Replace with your backend login endpoint
        { email, password }
      );

      if (response.status === 200) {
        const { user, token } = response.data;

        // Save user data and token
        setUser(user);
        localStorage.setItem("token", token);
        Cookies.set("token", token);

        // Show success toast and navigate to home page
        toast.success("Login successful! Welcome back!", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/home");
      }
    } catch (error) {
      // Handle errors and show error toast
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
      });
    }

    // Clear input fields
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
          alt="Uber Logo"
        />
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What is your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <div className="relative">
            <input
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type={showPassword ? "text" : "password"} // Toggle password visibility
              placeholder="••••••••"
              name="password"
              id="password"
            />
            <span
              className="absolute right-4 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="ri-eye-off-line"></i>
              ) : (
                <i className="ri-eye-line"></i>
              )}
            </span>
          </div>

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>
        <p className="text-center">
          New here?{" "}
          <Link to="/userSignUp" className="text-blue-600">
            Create new Account
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/CaptainLogin"
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default LoginUser;
