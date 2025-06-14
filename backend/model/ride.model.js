const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
      default: null,
      index: true,
    },
    pickup: {
      address: {
        type: String,
        required: [true, "Pickup address is required"],
        trim: true,
      },
      coordinates: {
        lat: {
          type: Number,
          required: [true, "Pickup latitude is required"],
        },
        lng: {
          type: Number,
          required: [true, "Pickup longitude is required"],
        },
      },
    },
    destination: {
      address: {
        type: String,
        required: [true, "Destination address is required"],
        trim: true,
      },
      coordinates: {
        lat: {
          type: Number,
          required: [true, "Destination latitude is required"],
        },
        lng: {
          type: Number,
          required: [true, "Destination longitude is required"],
        },
      },
    },
    vehicleType: {
      type: String,
      enum: {
        values: ["STANDARD", "COMFORT", "PREMIUM", "SHARE"],
        message:
          "Invalid vehicle type. Must be one of: STANDARD, COMFORT, PREMIUM, SHARE",
      },
      required: [true, "Vehicle type is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "CONFIRMED", "STARTED", "COMPLETED", "CANCELLED"],
        message: "Invalid ride status",
      },
      default: "PENDING",
      index: true,
    },
    fare: {
      amount: {
        type: Number,
        required: [true, "Fare amount is required"],
        min: [0, "Fare amount cannot be negative"],
      },
      currency: {
        type: String,
        default: "USD",
        uppercase: true,
      },
      breakdown: {
        baseFare: {
          type: Number,
          required: true,
        },
        distanceFare: {
          type: Number,
          required: true,
        },
        timeFare: {
          type: Number,
          required: true,
        },
        surgeMultiplier: {
          type: Number,
          default: 1.0,
          min: 1.0,
        },
      },
    },
    distance: {
      value: {
        type: Number,
        required: [true, "Distance value is required"],
        min: [0, "Distance cannot be negative"],
      },
      unit: {
        type: String,
        enum: ["km", "mi"],
        default: "km",
      },
      text: {
        type: String,
        required: [true, "Distance text is required"],
      },
    },
    duration: {
      value: {
        type: Number,
        required: [true, "Duration value is required"],
        min: [0, "Duration cannot be negative"],
      },
      unit: {
        type: String,
        enum: ["min", "hr"],
        default: "min",
      },
      text: {
        type: String,
        required: [true, "Duration text is required"],
      },
    },
    rating: {
      userRating: {
        value: {
          type: Number,
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: {
          type: String,
          maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        createdAt: Date,
      },
      captainRating: {
        value: {
          type: Number,
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: {
          type: String,
          maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        createdAt: Date,
      },
    },
    payment: {
      status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
        default: "PENDING",
      },
      method: {
        type: String,
        enum: ["CASH", "CARD", "WALLET"],
        required: [true, "Payment method is required"],
      },
      transactionId: String,
      amount: {
        type: Number,
        required: [true, "Payment amount is required"],
        min: [0, "Payment amount cannot be negative"],
      },
      currency: {
        type: String,
        default: "USD",
        uppercase: true,
      },
      receipt: {
        url: String,
        number: String,
      },
      refund: {
        amount: Number,
        reason: String,
        processedAt: Date,
      },
    },
    otp: {
      code: {
        type: String,
        required: [true, "OTP code is required"],
        select: false,
      },
      expiresAt: {
        type: Date,
        required: [true, "OTP expiration time is required"],
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    cancellation: {
      reason: {
        type: String,
        enum: [
          "USER_CANCELLED",
          "CAPTAIN_CANCELLED",
          "NO_CAPTAIN_FOUND",
          "PAYMENT_FAILED",
          "OTHER",
        ],
      },
      comment: String,
      cancelledBy: {
        type: String,
        enum: ["USER", "CAPTAIN", "SYSTEM"],
      },
      cancelledAt: Date,
    },
    tracking: {
      captainLocation: {
        lat: Number,
        lng: Number,
        updatedAt: Date,
      },
      estimatedArrival: Date,
      actualArrival: Date,
      actualDeparture: Date,
      actualCompletion: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
rideSchema.index({ "pickup.coordinates": "2dsphere" });
rideSchema.index({ "destination.coordinates": "2dsphere" });
rideSchema.index({ createdAt: -1 });
rideSchema.index({ status: 1, createdAt: -1 });
rideSchema.index({ user: 1, status: 1 });
rideSchema.index({ captain: 1, status: 1 });

// Virtual for ride duration in minutes
rideSchema.virtual("durationInMinutes").get(function () {
  if (this.duration.unit === "min") {
    return this.duration.value;
  }
  return this.duration.value * 60;
});

// Virtual for ride distance in kilometers
rideSchema.virtual("distanceInKm").get(function () {
  if (this.distance.unit === "km") {
    return this.distance.value;
  }
  return this.distance.value * 1.60934;
});

// Method to check if ride can be cancelled
rideSchema.methods.canBeCancelled = function () {
  return ["PENDING", "CONFIRMED"].includes(this.status);
};

// Method to check if ride can be rated
rideSchema.methods.canBeRated = function () {
  return this.status === "COMPLETED" && !this.rating.userRating;
};

// Method to check if OTP is valid
rideSchema.methods.isOtpValid = function (otp) {
  return (
    this.otp.code === otp &&
    this.otp.expiresAt > new Date() &&
    !this.otp.verified
  );
};

// Static method to find active rides
rideSchema.statics.findActiveRides = function () {
  return this.find({
    status: { $in: ["PENDING", "CONFIRMED", "STARTED"] },
  });
};

// Static method to find nearby pending rides
rideSchema.statics.findNearbyPendingRides = function (
  coordinates,
  maxDistance = 5000
) {
  return this.find({
    status: "PENDING",
    "pickup.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        },
        $maxDistance: maxDistance,
      },
    },
  });
};

// Pre-save middleware to handle OTP generation
rideSchema.pre("save", async function (next) {
  if (this.isNew) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      verified: false,
    };
  }
  next();
});

// Pre-save middleware to handle status changes
rideSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    const now = new Date();
    switch (this.status) {
      case "CONFIRMED":
        this.tracking.estimatedArrival = new Date(now.getTime() + 15 * 60000); // 15 minutes
        break;
      case "STARTED":
        this.tracking.actualDeparture = now;
        break;
      case "COMPLETED":
        this.tracking.actualCompletion = now;
        break;
      case "CANCELLED":
        this.cancellation.cancelledAt = now;
        break;
    }
  }
  next();
});

const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;
