const CaptainModel = require("../model/captain.model");

module.exports.createCaptain = async (captainData) => {
  const {
    fullName,
    email,
    password,
    address,
    vehicleType,
    vehicleName,
    vehicleNumber,
    vehicleModel,
    vehicleColor,
    vehiclePlate,
    vehicleYear,
    vehicleCapacity,
  } = captainData;
  if (
    !fullName ||
    !email ||
    !password ||
    !address ||
    !vehicleType ||
    !vehiclePlate ||
    !vehicleCapacity ||
    !vehicleColor ||
    !vehicleModel ||
    !vehicleName ||
    !vehicleNumber ||
    !vehicleYear
  ) {
    throw new Error("All fields are required");
  }
  const captain = CaptainModel.create({
    fullName: {
      firstName: fullName.firstName,
      lastName: fullName.lastName,
    },
    email,
    password,
    address,
    vehicle: {
      vehicleCapacity,
      vehicleColor,
      vehicleModel,
      vehicleName,
      vehicleNumber,
      vehiclePlate,
      vehicleYear,
      vehicleType,
    },
  });
  return captain;
};
