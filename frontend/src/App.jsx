import { UserProvider } from "./context/UserContext";
import { SocketProvider } from "./context/SocketContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Riding from "./pages/Riding";

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/riding" element={<Riding />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
