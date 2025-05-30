import React from "react";
import { Link } from "react-router-dom";
import UserSignUp from "./UserSignUp";
import { useState } from "react";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUseData] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    setUseData({
      email: email,
      password: password,
    });
    console.log(userData);
    setEmail("");
    setPassword("");
  };
  return (
    <div className="p-5 flex flex-col justify-between h-screen ">
      <div>
        <img
          className="absolute top-4 left-4 w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber logo"
        />
        <form onSubmit={handleSubmit}>
          <h3 className=" text-lg font-medium mb-3 mt-14 ">
            {" "}
            what's your email
          </h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className=" bg-[#eeeeee]  rounded px-4 py-4 border w-full text-lg placeholder:text-xs"
            type="email"
            placeholder="your email@example.com"
          />
          <h3 className=" text-lg font-medium mb-3 mt-3 ">enter password</h3>
          <input
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeeeee] rounded px-4 py-4 border w-full text-lg placeholder:text-xs  "
            type="password"
            placeholder="************"
          />
          <button
            className="bg-[#111] text-white mt-6 font-semibold mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-xl "
            type="submit"
          >
            Login
          </button>
          <p className="text-center">
            <Link to="/UserSignUp" className="mb-7 text-blue-600 ">
              Create New Account
            </Link>
          </p>{" "}
        </form>
      </div>
      <div>
        <button className="bg-[#10b461] text-white mt-3 font-semibold mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-xl ">
          Sign In as Captain{" "}
        </button>
      </div>
    </div>
  );
};

export default LoginUser;
