import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Providers
import UserContext from "./context/UserContext";
import CaptainContext from "./context/captainContext";
import { SocketProvider } from "./context/SocketContext";

// Protection Wrappers
import UserProtectWrapper from "./pages/UserProtectWrapper";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";

// Public Pages
import Start from "./pages/Start";
import LoginUser from "./pages/LoginUser";
import UserSignUp from "./pages/UserSignUp";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignUp from "./pages/captainSignUp";

// Protected User Pages
import Home from "./pages/Home";
import Riding from "./pages/Riding";
import LogoutUser from "./pages/LogoutUser";

// Protected Captain Pages
import CaptainHome from "./pages/CaptainHome";
import LogoutCaptain from "./pages/LogoutCaptain";

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
          <SocketProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Start />} />
              <Route path="/LoginUser" element={<LoginUser />} />
              <Route path="/signup" element={<UserSignUp />} />
              <Route path="/captain/login" element={<CaptainLogin />} />
              <Route path="/captain/signup" element={<CaptainSignUp />} />

              {/* Protected User Routes */}
              <Route
                path="/home"
                element={
                  <UserProtectWrapper>
                    <Home />
                  </UserProtectWrapper>
                }
              />
              <Route
                path="/riding"
                element={
                  <UserProtectWrapper>
                    <Riding />
                  </UserProtectWrapper>
                }
              />
              <Route
                path="/user/logout"
                element={
                  <UserProtectWrapper>
                    <LogoutUser />
                  </UserProtectWrapper>
                }
              />

              {/* Protected Captain Routes */}
              <Route
                path="/captain/home"
                element={
                  <CaptainProtectWrapper>
                    <CaptainHome />
                  </CaptainProtectWrapper>
                }
              />
              <Route
                path="/captain/logout"
                element={
                  <CaptainProtectWrapper>
                    <LogoutCaptain />
                  </CaptainProtectWrapper>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SocketProvider>
        </CaptainContext>
      </UserContext>
    </>
  );
}

export default App;
