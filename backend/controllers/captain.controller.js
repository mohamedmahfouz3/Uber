const CaptainModel = require("../model/captain.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const { validationResult } = require("express-validator");
const blacklistTokenSchema = require("../model/blacklistToken.model");

// Function to register a new captain
module.exports.registerCaptain = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { fullName, email, password, address, vehicle } = req.body;

    if (!vehicle) {
      return res
        .status(400)
        .json({ message: "Vehicle information is required" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await CaptainModel.hashPassword(password);
    console.log("Hashed password:", hashedPassword);
    // Create a new captain
    const newCaptain = await CaptainModel.create({
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName,
      },
      email,
      password: hashedPassword,
      address,
      vehicle: {
        vehicleCapacity: vehicle.vehicleCapacity,
        vehicleColor: vehicle.vehicleColor,
        vehicleModel: vehicle.vehicleModel,
        vehicleName: vehicle.vehicleName,
        vehicleNumber: vehicle.vehicleNumber,
        vehiclePlate: vehicle.vehiclePlate,
        vehicleYear: vehicle.vehicleYear,
        vehicleType: vehicle.vehicleType,
      },
    });

    // Generate a token
    const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set the token in the response header
    res.setHeader("Authorization", `Bearer ${token}`);
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return the captain data and token
    return res.status(201).json({
      message: "Captain registered successfully",
      captain: {
        id: newCaptain._id,
        fullName: newCaptain.fullName,
        email: newCaptain.email,
        address: newCaptain.address,
        password: newCaptain.password,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering captain:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to login a captain
module.exports.loginCaptain = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    // Find the captain by email
    const captain = await CaptainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }
    // Check if the password is correct

    const isMatch = await bcrypt.compare(password, captain.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate a token
    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    // Set the token in the response header
    res.setHeader("Authorization", `Bearer ${token}`);
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return the captain data and token
    return res.status(200).json({
      message: "Captain logged in successfully",
      captain: {
        id: captain._id,
        fullName: captain.fullName,
        email: captain.email,
        address: captain.address,
        password: captain.password,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in captain:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Function to get the profile of the logged-in captain
module.exports.getCaptainProfile = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  res.status(200).json({
    message: "Captain profile retrieved successfully",
    captain: req.captain,
  });
};

// Function to logout a captain
module.exports.logoutCaptain = async (req, res) => {
  try {
    // Clear the token from the cookie
    res.clearCookie("token");
    // Add the token to the blacklist
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      const blacklistedToken = new blacklistTokenSchema({ token });
      await blacklistedToken.save();
    }
    // Clear the token from the request headers
    req.headers.authorization = null;

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: error.message });
  }
};
