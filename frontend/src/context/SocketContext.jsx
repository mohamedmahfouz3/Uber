/*import React, { createContext, useContext, useRef, useEffect } from "react";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      // Replace with your backend socket URL
      const socketUrl = "ws://localhost:4000";
      socketRef.current = new WebSocket(socketUrl);

      socketRef.current.onopen = () => {
        console.log("WebSocket connected");
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket disconnected");
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // Clean up on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
*/

import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext({ socket: null });

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only initialize socket on client side
    if (typeof window !== "undefined") {
      const socketInstance = io("http://localhost:5000", {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketInstance.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      setSocket(socketInstance);

      // Cleanup on unmount
      return () => {
        if (socketInstance) {
          socketInstance.disconnect();
        }
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
