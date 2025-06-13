const rideModel = require("../model/ride.model");
const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapController = require("./map.controller");

// Function to create a new ride
module.exports.createRide = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract data from the request body
  try {
    const { pickup, destination, vehicleType } = req.body;

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate the request body
    if (!pickup || !destination || !vehicleType) {
      return res.status(400).json({
        message: "Pickup, destination, and vehicle type are required",
      });
    }
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    return res.status(201).json({
      message: "Ride created successfully",
      ride,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Function to get fare estimate
module.exports.getFare = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    // Get distance and time from Google Maps API
    const distanceTime = await mapController.getDistanceTime({
      query: { origin: pickup, destination },
    });

    // Calculate fare based on distance (simple calculation for now)
    // Base fare: $2.50
    // Per mile: $1.50
    // Minimum fare: $5.00
    const baseFare = 2.5;
    const perMileRate = 1.5;
    const minimumFare = 5.0;

    const distanceInMiles = distanceTime.distance.value / 1609.34; // Convert meters to miles
    let fare = baseFare + distanceInMiles * perMileRate;
    fare = Math.max(fare, minimumFare);

    return res.status(200).json({
      distance: distanceTime.distance,
      duration: distanceTime.duration,
      fare: {
        amount: fare.toFixed(2),
        currency: "USD",
        breakdown: {
          baseFare,
          distanceFare: (distanceInMiles * perMileRate).toFixed(2),
          distanceInMiles: distanceInMiles.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error("Error calculating fare:", error);
    return res.status(500).json({ message: "Error calculating fare" });
  }
};
