const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    pickupLocation: {
      type: String,
      required: true,
    },
    dropOffLocation: {
      type: String,
      required: true,
    },
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "canceled"],
      default: "pending",
    },
    fare: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const rideModel = mongoose.model("Ride", rideSchema);
module.exports = rideModel;
