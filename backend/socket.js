const socketIO = require("socket.io");
const Ride = require("./model/ride.model");
const userModel = require("./model/user.model");
const CaptainModel = require("./model/captain.model");
const { AppError } = require("./utils/appError");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
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

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Handle user/captain online status
    socket.on("USER_ONLINE", async (data) => {
      try {
        const { userId, userType } = data;
        if (userType === "captain") {
          await CaptainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }
      } catch (error) {
        console.error("Error updating socket ID:", error);
      }
    });

    // Handle ride status updates
    socket.on("RIDE_STATUS_UPDATE", async (data) => {
      try {
        const { rideId, status, userId } = data;
        const ride = await Ride.findById(rideId);

        if (!ride) {
          throw new AppError("Ride not found", 404);
        }

        // Update ride status
        ride.status = status;
        await ride.save();

        // Notify relevant parties
        if (ride.user.socketId) {
          io.to(ride.user.socketId).emit("RIDE_UPDATED", {
            rideId,
            status,
            update: "status",
          });
        }

        if (ride.captain && ride.captain.socketId) {
          io.to(ride.captain.socketId).emit("RIDE_UPDATED", {
            rideId,
            status,
            update: "status",
          });
        }
      } catch (error) {
        console.error("Error updating ride status:", error);
        socket.emit("ERROR", { message: error.message });
      }
    });

    // Handle location updates
    socket.on("LOCATION_UPDATE", async (data) => {
      try {
        const { rideId, location, userId, userType } = data;
        const ride = await Ride.findById(rideId);

        if (!ride) {
          throw new AppError("Ride not found", 404);
        }

        // Update location based on user type
        if (userType === "captain") {
          ride.captainLocation = location;
        } else {
          ride.userLocation = location;
        }
        await ride.save();

        // Notify the other party
        const targetSocketId =
          userType === "captain" ? ride.user.socketId : ride.captain?.socketId;

        if (targetSocketId) {
          io.to(targetSocketId).emit("LOCATION_UPDATED", {
            rideId,
            location,
            userType,
          });
        }
      } catch (error) {
        console.error("Error updating location:", error);
        socket.emit("ERROR", { message: error.message });
      }
    });

    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);
      // Update user/captain offline status
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          { $unset: { socketId: 1 } }
        );
        await Captain.findOneAndUpdate(
          { socketId: socket.id },
          { $unset: { socketId: 1 } }
        );
      } catch (error) {
        console.error("Error updating offline status:", error);
      }
    });
  });

  return io;
};

const sendMessageToSocketId = (socketId, message) => {
  if (io && socketId) {
    io.to(socketId).emit("MESSAGE", message);
  }
};

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};
