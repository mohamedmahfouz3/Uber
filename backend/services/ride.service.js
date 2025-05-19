const rideModel = require("../model/ride.model");
const mapService = require("../services/maps.service");

// function to get fare
async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }
  const distanceTime = await mapService.getDistanceTime(pickup, destination);
  const distance = distanceTime.distance; // in km
  const duration = distanceTime.duration; // in seconds
  const baseFare = 50; // base fare in currency
  const perKmRate = 10; // fare per km in currency
  const perMinuteRate = 2; // fare per minute in currency
  const fare =
    baseFare + distance * perKmRate + (duration / 60) * perMinuteRate;
  // Round the fare to 2 decimal places
  fare = Math.round(fare * 100) / 100;

  // Return the fare

  return fare;
}
// function to create a ride
async function createRide(userId, pickup, destination, vehicleType) {
  // check validation
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error(
      "User ID, pickup, destination, and vehicle type are required"
    );
  }
  // Check if the user exists
  const user = await userModel.findById(userId);
  if (!user) {
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
    const fare = await getFare(pickup, destination);
    const ride = await rideModel.create({
      user: userId,
      pickup: pickup,
      destination: destination,
      fare: fare[vehicleType],
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
}
