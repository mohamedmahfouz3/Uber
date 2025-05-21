const rideModel = require("../model/ride.model");
const mapService = require("../services/maps.service");
const userModel = require("../model/user.model");

const bcrypt = require("bcrypt");

const crypto = require("crypto");

// function to get fare
async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  // Get the distance and duration from the map service
  const distanceTime = await mapService.getDistanceTime(pickup, destination);
  if (!distanceTime) {
    throw new Error("Failed to get distance and duration");
  }
  const distance = distanceTime.distance;
  const duration = distanceTime.duration;
  // Calculate the fare based on the distance and duration
  const fare = {
    auto: Math.round(distance * 1.5 + duration * 0.5),
    car: Math.round(distance * 1.5 + duration * 0.5),
    bike: Math.round(distance * 1.2 + duration * 0.3),
    van: Math.round(distance * 2 + duration * 0.7),
  };
  // Check if the fare is valid
  if (!fare.car || !fare.bike || !fare.van) {
    throw new Error("Invalid fare calculation");
  }
  // Return the fare

  return fare;
}
// function to get otp
async function getOtp(number) {
  function generateOtp() {
    const otp = crypto
      .randomInt(Math.pow(10, number - 1), Math.pow(10, number))
      .toString();

    return otp;
  }
  return generateOtp(number);
}

// function to create a ride
module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  // check validation
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error(
      "User ID, pickup, destination, and vehicle type are required"
    );
  }
  // Check if the user exists
  const userExists = await userModel.findById(user);
  if (!userExists) {
    throw new Error("User not found");
  }
  // Check if the vehicle type is valid
  const validVehicleTypes = ["car", "bike", "van"];
  if (!validVehicleTypes.includes(vehicleType)) {
    throw new Error("Invalid vehicle type");
  }
  // Check if the pickup and destination are valid
  const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
  const destinationCoordinates = await mapService.getAddressCoordinates(
    destination
  );
  if (!pickupCoordinates || !destinationCoordinates) {
    throw new Error("Invalid pickup or destination");
  }
  // Check if the pickup and destination are not the same
  if (pickup === destination) {
    throw new Error("Pickup and destination cannot be the same");
  }

  try {
    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    const fare = await getFare(pickup, destination);
    const ride = await rideModel.create({
      user: user,
      pickup: pickup,
      destination: destination,
      fare: fare,
      distance: distanceTime.distance,
      duration: distanceTime.duration,
      fare: fare[vehicleType],
      otp: getOtp(6),
    });
    // Save the ride to the database
    if (!ride) {
      throw new Error("Failed to create ride");
    }
    // Return the created ride

    return ride;
  } catch (error) {
    throw new Error("Error creating ride: " + error.message);
  }
};
