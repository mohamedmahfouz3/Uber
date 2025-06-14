const RideService = require("../services/ride.service");
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendMessageToSocketId } = require("../socket");
const mapService = require("../services/maps.service");

/**
 * Create a new ride request
 * @route POST /api/rides
 * @access Private (User)
 */
exports.createRide = catchAsync(async (req, res, next) => {
  const { pickup, destination, vehicleType } = req.body;

  // Validate required fields
  if (!pickup || !destination || !vehicleType) {
    return next(new AppError("Missing required fields", 400));
  }

  // Validate coordinates
  if (
    !validateCoordinates(pickup.coordinates) ||
    !validateCoordinates(destination.coordinates)
  ) {
    return next(new AppError("Invalid coordinates", 400));
  }

  // Get address details if only coordinates provided
  if (!pickup.address) {
    try {
      const address = await mapService.getAddressFromCoordinates(
        pickup.coordinates
      );
      pickup.address = address;
    } catch (error) {
      return next(new AppError("Could not resolve pickup address", 400));
    }
  }

  if (!destination.address) {
    try {
      const address = await mapService.getAddressFromCoordinates(
        destination.coordinates
      );
      destination.address = address;
    } catch (error) {
      return next(new AppError("Could not resolve destination address", 400));
    }
  }

  const ride = await RideService.createRide(req.user.id, {
    pickup,
    destination,
    vehicleType,
  });

  // Send real-time notification to nearby captains
  if (ride.nearbyCaptains && ride.nearbyCaptains.length > 0) {
    ride.nearbyCaptains.forEach((captain) => {
      sendMessageToSocketId(captain.socketId, {
        type: "NEW_RIDE_REQUEST",
        data: {
          rideId: ride._id,
          pickup: ride.pickup,
          destination: ride.destination,
          fare: ride.fare,
          vehicleType: ride.vehicleType,
        },
      });
    });
  }

  res.status(201).json({
    status: "success",
    data: { ride },
  });
});

/**
 * Accept a ride request
 * @route POST /api/rides/:rideId/accept
 * @access Private (Captain)
 */
exports.acceptRide = catchAsync(async (req, res, next) => {
  const { rideId } = req.params;
  const ride = await RideService.acceptRide(rideId, req.user.id);

  // Send real-time notification to user
  sendMessageToSocketId(ride.user.socketId, {
    type: "RIDE_ACCEPTED",
    data: {
      rideId: ride._id,
      captain: {
        id: ride.captain._id,
        name: ride.captain.name,
        phone: ride.captain.phone,
        vehicle: ride.captain.vehicle,
        location: ride.captain.location,
      },
      estimatedArrival: ride.tracking.estimatedArrival,
    },
  });

  res.status(200).json({
    status: "success",
    data: { ride },
  });
});

/**
 * Start a ride
 * @route POST /api/rides/:rideId/start
 * @access Private (Captain)
 */
exports.startRide = catchAsync(async (req, res, next) => {
  const { rideId } = req.params;
  const { otp } = req.body;

  if (!otp) {
    return next(new AppError("OTP is required", 400));
  }

  const ride = await RideService.startRide(rideId, req.user.id, otp);

  // Send real-time notification to user
  sendMessageToSocketId(ride.user.socketId, {
    type: "RIDE_STARTED",
    data: {
      rideId: ride._id,
      startTime: ride.startedAt,
    },
  });

  res.status(200).json({
    status: "success",
    data: { ride },
  });
});

/**
 * Complete a ride
 * @route POST /api/rides/:rideId/complete
 * @access Private (Captain)
 */
exports.completeRide = catchAsync(async (req, res, next) => {
  const { rideId } = req.params;
  const ride = await RideService.completeRide(rideId, req.user.id);

  // Send real-time notification to user
  sendMessageToSocketId(ride.user.socketId, {
    type: "RIDE_COMPLETED",
    data: {
      rideId: ride._id,
      fare: ride.fare,
      payment: ride.payment,
      endTime: ride.completedAt,
    },
  });

  res.status(200).json({
    status: "success",
    data: { ride },
  });
});

/**
 * Cancel a ride
 * @route POST /api/rides/:rideId/cancel
 * @access Private (User/Captain)
 */
exports.cancelRide = catchAsync(async (req, res, next) => {
  const { rideId } = req.params;
  const { reason, comment } = req.body;

  if (!reason) {
    return next(new AppError("Cancellation reason is required", 400));
  }

  const ride = await RideService.cancelRide(
    rideId,
    req.user.id,
    reason,
    comment
  );

  // Send real-time notification to the other party
  const notificationData = {
    type: "RIDE_CANCELLED",
    data: {
      rideId: ride._id,
      reason,
      comment,
      cancelledBy: ride.cancellation.cancelledBy,
    },
  };

  if (req.user.role === "USER") {
    sendMessageToSocketId(ride.captain.socketId, notificationData);
  } else {
    sendMessageToSocketId(ride.user.socketId, notificationData);
  }

  res.status(200).json({
    status: "success",
    data: { ride },
  });
});

/**
 * Rate a ride
 * @route POST /api/rides/:rideId/rate
 * @access Private (User/Captain)
 */
exports.rateRide = catchAsync(async (req, res, next) => {
  const { rideId } = req.params;
  const { rating, comment, isCaptain } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError("Valid rating (1-5) is required", 400));
  }

  const ride = await RideService.rateRide(
    rideId,
    req.user.id,
    rating,
    comment,
    isCaptain
  );

  // Send real-time notification to the other party
  const notificationData = {
    type: "RIDE_RATED",
    data: {
      rideId: ride._id,
      rating,
      comment,
      ratedBy: isCaptain ? "CAPTAIN" : "USER",
    },
  };

  if (isCaptain) {
    sendMessageToSocketId(ride.user.socketId, notificationData);
  } else {
    sendMessageToSocketId(ride.captain.socketId, notificationData);
  }

  res.status(200).json({
    status: "success",
    data: { ride },
  });
});

/**
 * Update captain's location during ride
 * @route PATCH /api/rides/:rideId/location
 * @access Private (Captain)
 */
exports.updateLocation = catchAsync(async (req, res, next) => {
  const { rideId } = req.params;
  const { location } = req.body;

  if (!location || !validateCoordinates(location)) {
    return next(new AppError("Valid location coordinates are required", 400));
  }

  const ride = await RideService.updateCaptainLocation(
    rideId,
    req.user.id,
    location
  );

  // Send real-time location update to user
  sendMessageToSocketId(ride.user.socketId, {
    type: "CAPTAIN_LOCATION_UPDATE",
    data: {
      rideId: ride._id,
      location: ride.tracking.captainLocation,
      updatedAt: ride.tracking.captainLocation.updatedAt,
    },
  });

  res.status(200).json({
    status: "success",
    data: { ride },
  });
});

/**
 * Get user's ride history
 * @route GET /api/rides/history
 * @access Private (User)
 */
exports.getUserRides = catchAsync(async (req, res, next) => {
  const { status, page, limit } = req.query;
  const result = await RideService.getUserRides(req.user.id, {
    status,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  });

  res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * Get captain's ride history
 * @route GET /api/rides/captain/history
 * @access Private (Captain)
 */
exports.getCaptainRides = catchAsync(async (req, res, next) => {
  const { status, page, limit } = req.query;
  const result = await RideService.getCaptainRides(req.user.id, {
    status,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  });

  res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * Get user's active ride
 * @route GET /api/rides/active
 * @access Private (User)
 */
exports.getUserActiveRide = catchAsync(async (req, res, next) => {
  const ride = await RideService.getUserActiveRide(req.user.id);

  if (!ride) {
    return res.status(200).json({
      status: "success",
      data: { ride: null },
    });
  }

  res.status(200).json({
    status: "success",
    data: { ride },
  });
});

/**
 * Get captain's active ride
 * @route GET /api/rides/captain/active
 * @access Private (Captain)
 */
exports.getCaptainActiveRide = catchAsync(async (req, res, next) => {
  const ride = await RideService.getCaptainActiveRide(req.user.id);

  if (!ride) {
    return res.status(200).json({
      status: "success",
      data: { ride: null },
    });
  }

  res.status(200).json({
    status: "success",
    data: { ride },
  });
});

/**
 * Get ride details
 * @route GET /api/rides/:rideId
 * @access Private (User/Captain)
 */
exports.getRideDetails = catchAsync(async (req, res, next) => {
  const { rideId } = req.params;
  const ride = await RideService.getRideDetails(rideId);

  if (!ride) {
    return next(new AppError("Ride not found", 404));
  }

  // Check authorization
  const isUser = ride.user._id.toString() === req.user.id;
  const isCaptain = ride.captain && ride.captain._id.toString() === req.user.id;

  if (!isUser && !isCaptain) {
    return next(new AppError("Not authorized to view this ride", 403));
  }

  res.status(200).json({
    status: "success",
    data: { ride },
  });
});
