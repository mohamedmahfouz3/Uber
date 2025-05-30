import React from "react";
import { Link } from "react-router-dom";
import LoginUser from "./LoginUser";

const Home = () => {
  return (
    <div>
      <div className=" bg-cover bg-center bg-[url(https://www.istockphoto.com/photo/traffic-light-on-street-with-red-signal-lit-up-gm92272747-1043344?irclickid=TjeVeu2qtxycWJJRnl1GLT86UksTc%3AVgNSGl2I0&irgwc=1&cid=IS&utm_medium=affiliate&utm_source=Freepik%20Company%2C%20S.L.&clickid=TjeVeu2qtxycWJJRnl1GLT86UksTc%3AVgNSGl2I0&utm_term=idp&utm_campaign=&utm_content=917949&irpid=39422)] h-screen pt-8 flex justify-between flex-col w-full bg-red-400 ">
        <img
          className="absolute top-4 left-4 w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber logo"
        />
        <div className="bg-white pb-7 py-4 px-4  ">
          <h2 className="text-2xl font-bold text-black text-center">
            Get started with Uber
          </h2>
          <Link
            to="/LoginUser"
            className="flex items-center justify-center w-48 bg-black text-white py-3 rounded"
          >
            Continue
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
