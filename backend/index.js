const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const userModel = require("./model/user.model");
const captainModel = require("./model/captain.model");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining
  socket.on("join", async ({ userType, userId }) => {
    try {
      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
      console.log(`${userType} joined:`, userId);
    } catch (error) {
      console.error("Error updating socket ID:", error);
    }
  });

  // Handle ride requests
  socket.on("ride-request", async (rideData) => {
    try {
      // Find available captains
      const availableCaptains = await captainModel.find({
        status: "active",
        socketId: { $exists: true },
      });

      // Emit ride request to all available captains
      availableCaptains.forEach((captain) => {
        io.to(captain.socketId).emit("new-ride-request", rideData);
      });
    } catch (error) {
      console.error("Error handling ride request:", error);
    }
  });

  // Handle ride acceptance
  socket.on("ride-accept", async ({ rideId, captainId }) => {
    try {
      const captain = await captainModel.findById(captainId);
      if (captain && captain.socketId) {
        // Notify the user that their ride was accepted
        io.to(captain.socketId).emit("ride-confirm", { rideId, captain });
      }
    } catch (error) {
      console.error("Error handling ride acceptance:", error);
    }
  });

  // Handle ride start
  socket.on("ride-start", async ({ rideId, userId }) => {
    try {
      const user = await userModel.findById(userId);
      if (user && user.socketId) {
        io.to(user.socketId).emit("ride-start", { rideId });
      }
    } catch (error) {
      console.error("Error handling ride start:", error);
    }
  });

  // Handle ride completion
  socket.on("ride-complete", async ({ rideId, userId }) => {
    try {
      const user = await userModel.findById(userId);
      if (user && user.socketId) {
        io.to(user.socketId).emit("ride-complete", { rideId });
      }
    } catch (error) {
      console.error("Error handling ride completion:", error);
    }
  });

  // Handle location updates
  socket.on("location-update", ({ userId, location }) => {
    socket.broadcast.emit("location-updated", { userId, location });
  });

  // Handle disconnection
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
    try {
      // Remove socket ID from user or captain
      await userModel.findOneAndUpdate(
        { socketId: socket.id },
        { $unset: { socketId: 1 } }
      );
      await captainModel.findOneAndUpdate(
        { socketId: socket.id },
        { $unset: { socketId: 1 } }
      );
    } catch (error) {
      console.error("Error handling disconnection:", error);
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = server;
