const rideModel = require("../model/ride.model");
const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");

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



