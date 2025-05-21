const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    captain: {
      type: mongoose.Schema.ObjectId,
      ref: "Captain",
      default: null,
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "ongoing", "completed", "canceled"],
      default: "pending",
    },
    fare: {
      type: Number,
      required: true,
    },
    distance: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    paymentId: {
      type: String,
    },
    paymentDetails: {
      type: Object,
    },

    orderId: {
      type: String,
    },

    signature: {
      type: String,
    },
    otp: {
      type: String,
      select: false,
      required: true,
    },
  },

  { timestamps: true }
);
const rideModel = mongoose.model("Ride", rideSchema);
module.exports = rideModel;
