import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginUser from "./pages/LoginUser";
import Home from "./pages/Home";
import CaptainLogin from "./pages/CaptainLogin";
import UserSignUp from "./pages/UserSignUp";
import CaptainSignUp from "./pages/captainSignUp";
import Start from "./pages/Start";
import UserContext from "./context/UserContext";
import CaptainContext from "./context/captainContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <UserContext>
        <CaptainContext>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/home" element={<Home />} />
            <Route path="/LoginUser" element={<LoginUser />} />
            <Route path="/captainLogin" element={<CaptainLogin />} />
            <Route path="/userSignUp" element={<UserSignUp />} />
            <Route path="/captainSignUp" element={<CaptainSignUp />} />
          </Routes>
        </CaptainContext>
      </UserContext>
    </>
  );
}

export default App;
