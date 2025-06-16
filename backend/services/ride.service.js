const Ride = require("../model/ride.model");
const User = require("../model/user.model");
const Captain = require("../model/captain.model");
const mapService = require("./maps.service");
const notificationService = require("./notification.service");
const { AppError } = require("../utils/appError");
const { calculateFare } = require("../utils/fareCalculator");
const { validateCoordinates } = require("../utils/validateCoordinates.js");

// Constants
const DEFAULT_SEARCH_RADIUS = 5000; // 5km
const MAX_ACTIVE_RIDES = 1;
const OTP_EXPIRY_MINUTES = 10;
const ESTIMATED_ARRIVAL_MINUTES = 15;

class RideService {
  /**
   * Calculate fare based on distance and duration
   * @param {number} distance - Distance in kilometers
   * @param {number} duration - Duration in minutes
   * @returns {number} Calculated fare
   */
  static async calculateFare(distance, duration) {
    // Base fare
    const baseFare = 50;

    // Per kilometer rate
    const perKmRate = 15;

    // Per minute rate
    const perMinRate = 2;

    // Calculate fare components
    const distanceFare = distance * perKmRate;
    const timeFare = duration * perMinRate;

    // Total fare
    const totalFare = baseFare + distanceFare + timeFare;

    // Round to nearest rupee
    return Math.round(totalFare);
  }

  /**
   * Create a new ride request
   */
  static async createRide(userId, rideData) {
    // Validate coordinates
    validateCoordinates(rideData.pickup.coordinates);
    validateCoordinates(rideData.destination.coordinates);

    // Check if user has any active rides
    const activeRides = await Ride.find({
      user: userId,
      status: { $in: ["PENDING", "CONFIRMED", "STARTED"] },
    });

    if (activeRides.length >= MAX_ACTIVE_RIDES) {
      throw new AppError("You already have an active ride", 400);
    }

    // Get distance and duration from map service
    const { distance, duration } = await mapService.getDistanceTime(
      rideData.pickup.coordinates,
      rideData.destination.coordinates
    );

    if (!distance || !duration) {
      throw new AppError("Could not calculate route", 400);
    }

    // Calculate fare
    const fare = await calculateFare(distance, duration, rideData.vehicleType);

    // Create ride
    const ride = await Ride.create({
      user: userId,
      pickup: {
        address: rideData.pickup.address,
        coordinates: rideData.pickup.coordinates,
      },
      destination: {
        address: rideData.destination.address,
        coordinates: rideData.destination.coordinates,
      },
      vehicleType: rideData.vehicleType,
      fare,
      distance,
      duration,
    });

    // Find nearby captains
    const nearbyCaptains = await Captain.find({
      status: "AVAILABLE",
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              rideData.pickup.coordinates.lng,
              rideData.pickup.coordinates.lat,
            ],
          },
          $maxDistance: DEFAULT_SEARCH_RADIUS,
        },
      },
    }).limit(10);

    // Notify nearby captains
    if (nearbyCaptains.length > 0) {
      await notificationService.notifyCaptains(nearbyCaptains, {
        type: "NEW_RIDE_REQUEST",
        rideId: ride._id,
        pickup: ride.pickup,
        destination: ride.destination,
        fare: ride.fare,
      });
    }

    return ride;
  }

  /**
   * Accept a ride request by a captain
   */
  static async acceptRide(rideId, captainId) {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError("Ride not found", 404);
    }

    if (ride.status !== "PENDING") {
      throw new AppError("Ride is no longer available", 400);
    }

    // Check if captain is available
    const captain = await Captain.findById(captainId);
    if (!captain || captain.status !== "AVAILABLE") {
      throw new AppError("Captain is not available", 400);
    }

    // Update ride
    ride.captain = captainId;
    ride.status = "CONFIRMED";
    await ride.save();

    // Update captain status
    captain.status = "BUSY";
    await captain.save();

    // Notify user
    const user = await User.findById(ride.user);
    if (user) {
      await notificationService.notifyUser(user, {
        type: "RIDE_CONFIRMED",
        rideId: ride._id,
        captain: {
          id: captain._id,
          name: captain.name,
          phone: captain.phone,
          vehicle: captain.vehicle,
        },
        estimatedArrival: ride.tracking.estimatedArrival,
      });
    }

    return ride;
  }

  /**
   * Start a ride
   */
  static async startRide(rideId, captainId, otp) {
    const ride = await Ride.findById(rideId).select("+otp.code");
    if (!ride) {
      throw new AppError("Ride not found", 404);
    }

    if (ride.captain.toString() !== captainId) {
      throw new AppError("Unauthorized", 403);
    }

    if (ride.status !== "CONFIRMED") {
      throw new AppError("Ride cannot be started", 400);
    }

    if (!ride.isOtpValid(otp)) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    ride.status = "STARTED";
    ride.otp.verified = true;
    await ride.save();

    // Notify user
    const user = await User.findById(ride.user);
    if (user) {
      await notificationService.notifyUser(user, {
        type: "RIDE_STARTED",
        rideId: ride._id,
      });
    }

    return ride;
  }

  /**
   * Complete a ride
   */
  static async completeRide(rideId, captainId) {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError("Ride not found", 404);
    }

    if (ride.captain.toString() !== captainId) {
      throw new AppError("Unauthorized", 403);
    }

    if (ride.status !== "STARTED") {
      throw new AppError("Ride cannot be completed", 400);
    }

    ride.status = "COMPLETED";
    await ride.save();

    // Update captain status
    const captain = await Captain.findById(captainId);
    if (captain) {
      captain.status = "AVAILABLE";
      await captain.save();
    }

    // Notify user
    const user = await User.findById(ride.user);
    if (user) {
      await notificationService.notifyUser(user, {
        type: "RIDE_COMPLETED",
        rideId: ride._id,
        fare: ride.fare,
      });
    }

    return ride;
  }

  /**
   * Cancel a ride
   */
  static async cancelRide(rideId, userId, reason, comment) {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError("Ride not found", 404);
    }

    if (!ride.canBeCancelled()) {
      throw new AppError("Ride cannot be cancelled", 400);
    }

    // Check authorization
    const isUser = ride.user.toString() === userId;
    const isCaptain = ride.captain && ride.captain.toString() === userId;
    if (!isUser && !isCaptain) {
      throw new AppError("Unauthorized", 403);
    }

    // Update ride
    ride.status = "CANCELLED";
    ride.cancellation = {
      reason,
      comment,
      cancelledBy: isUser ? "USER" : "CAPTAIN",
      cancelledAt: new Date(),
    };
    await ride.save();

    // Update captain status if applicable
    if (ride.captain) {
      const captain = await Captain.findById(ride.captain);
      if (captain) {
        captain.status = "AVAILABLE";
        await captain.save();
      }
    }

    // Notify relevant parties
    const notifications = [];
    if (isUser) {
      const captain = await Captain.findById(ride.captain);
      if (captain) {
        notifications.push(
          notificationService.notifyCaptain(captain, {
            type: "RIDE_CANCELLED",
            rideId: ride._id,
            reason,
          })
        );
      }
    } else {
      const user = await User.findById(ride.user);
      if (user) {
        notifications.push(
          notificationService.notifyUser(user, {
            type: "RIDE_CANCELLED",
            rideId: ride._id,
            reason,
          })
        );
      }
    }

    await Promise.all(notifications);

    return ride;
  }

  /**
   * Rate a ride
   */
  static async rateRide(rideId, userId, rating, comment, isCaptain = false) {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError("Ride not found", 404);
    }

    if (!ride.canBeRated()) {
      throw new AppError("Ride cannot be rated", 400);
    }

    // Check authorization
    const isUser = ride.user.toString() === userId;
    const isRideCaptain = ride.captain && ride.captain.toString() === userId;

    if ((isCaptain && !isRideCaptain) || (!isCaptain && !isUser)) {
      throw new AppError("Unauthorized", 403);
    }

    // Update rating
    const ratingData = {
      value: rating,
      comment,
      createdAt: new Date(),
    };

    if (isCaptain) {
      ride.rating.captainRating = ratingData;
    } else {
      ride.rating.userRating = ratingData;
    }

    await ride.save();

    // Update user/captain average rating
    if (isCaptain) {
      await this.updateUserRating(ride.user);
    } else {
      await this.updateCaptainRating(ride.captain);
    }

    return ride;
  }

  /**
   * Update user's average rating
   */
  static async updateUserRating(userId) {
    const rides = await Ride.find({
      user: userId,
      "rating.userRating": { $exists: true },
    });

    if (rides.length === 0) return;

    const totalRating = rides.reduce(
      (sum, ride) => sum + ride.rating.userRating.value,
      0
    );
    const averageRating = totalRating / rides.length;

    await User.findByIdAndUpdate(userId, {
      rating: averageRating,
    });
  }

  /**
   * Update captain's average rating
   */
  static async updateCaptainRating(captainId) {
    const rides = await Ride.find({
      captain: captainId,
      "rating.captainRating": { $exists: true },
    });

    if (rides.length === 0) return;

    const totalRating = rides.reduce(
      (sum, ride) => sum + ride.rating.captainRating.value,
      0
    );
    const averageRating = totalRating / rides.length;

    await Captain.findByIdAndUpdate(captainId, {
      rating: averageRating,
    });
  }

  /**
   * Get ride history for a user
   */
  static async getUserRides(userId, { status, page = 1, limit = 10 }) {
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("captain", "name phone vehicle");

    const total = await Ride.countDocuments(query);

    return {
      rides,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get ride history for a captain
   */
  static async getCaptainRides(captainId, { status, page = 1, limit = 10 }) {
    const query = { captain: captainId };
    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name phone");

    const total = await Ride.countDocuments(query);

    return {
      rides,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update captain's location during ride
   */
  static async updateCaptainLocation(rideId, captainId, location) {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError("Ride not found", 404);
    }

    if (ride.captain.toString() !== captainId) {
      throw new AppError("Unauthorized", 403);
    }

    if (!["CONFIRMED", "STARTED"].includes(ride.status)) {
      throw new AppError("Cannot update location for this ride", 400);
    }

    validateCoordinates(location);

    ride.tracking.captainLocation = {
      ...location,
      updatedAt: new Date(),
    };

    await ride.save();

    // Notify user of location update
    const user = await User.findById(ride.user);
    if (user) {
      await notificationService.notifyUser(user, {
        type: "CAPTAIN_LOCATION_UPDATE",
        rideId: ride._id,
        location: ride.tracking.captainLocation,
      });
    }

    return ride;
  }

  /**
   * Get active ride for a user
   */
  static async getUserActiveRide(userId) {
    return Ride.findOne({
      user: userId,
      status: { $in: ["PENDING", "CONFIRMED", "STARTED"] },
    }).populate("captain", "name phone vehicle");
  }

  /**
   * Get active ride for a captain
   */
  static async getCaptainActiveRide(captainId) {
    return Ride.findOne({
      captain: captainId,
      status: { $in: ["CONFIRMED", "STARTED"] },
    }).populate("user", "name phone");
  }
}

module.exports = RideService;
