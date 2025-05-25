import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginUser from "./pages/LoginUser";
import Home from "./pages/Home";
import CaptainLogin from "./pages/CaptainLogin";
import UserSignUp from "./pages/UserSignUp";

import CaptainSignUp from "./pages/captainSignUp";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LoginUser" element={<LoginUser />} />
        <Route path="/captainLogin" element={<CaptainLogin />} />
        <Route path="/userSignUp" element={<UserSignUp />} />
        <Route path="/captainSignUp" element={<CaptainSignUp />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
