import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        fullName: {
          firstName,
          lastName,
        },
        email,
        password,
      };

      const response = await axios.post(
        "http://localhost:5000/users/register",
        userData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem("token", token);
        Cookies.set("token", token, {
          expires: 7,
          secure: window.location.protocol === "https:",
          sameSite: "lax",
        });
        toast.success("Account created successfully! Welcome to Uber!", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/home");
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );

      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          if (err.path === "fullName.firstName")
            serverErrors.firstName = err.msg;
          if (err.path === "fullName.lastName") serverErrors.lastName = err.msg;
          if (err.path === "email") serverErrors.email = err.msg;
          if (err.path === "password") serverErrors.password = err.msg;
        });
        setValidationErrors(serverErrors);
        toast.error("Please fix the validation errors before submitting.", {
          position: "top-center",
          autoClose: 5000,
        });
      } else {
        const message =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        toast.error(message, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };
  return (
    <div>
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
          <img
            className="w-16 mb-10"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
            alt=""
          />

          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <h3 className="text-lg w-1/2  font-medium mb-10">
              What's your name
            </h3>
            <div className="flex gap-4 mb-7">
              <input
                required
                className={`bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base ${
                  validationErrors.firstName ? "border-red-500" : ""
                }`}
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              {validationErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.firstName}
                </p>
              )}
              <input
                required
                className={`bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base ${
                  validationErrors.lastName ? "border-red-500" : ""
                }`}
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.lastName}
                </p>
              )}
            </div>

            <h3 className="text-lg font-medium mb-2">What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={`bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base ${
                validationErrors.email ? "border-red-500" : ""
              }`}
              type="email"
              placeholder="email@example.com"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm -mt-6 mb-7">
                {validationErrors.email}
              </p>
            )}

            <h3 className="text-lg font-medium mb-2">Enter Password</h3>

            <input
              className={`bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base ${
                validationErrors.password ? "border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              type="password"
              placeholder="password"
            />
            {validationErrors.password && (
              <p className="text-red-500 text-sm -mt-6 mb-7">
                {validationErrors.password}
              </p>
            )}

            <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
              Create account
            </button>
          </form>
          <p className="text-center">
            Already have a account?{" "}
            <Link to="/LoginUser" className="text-blue-600">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
