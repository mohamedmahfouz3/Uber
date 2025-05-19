const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");
const CaptainModel = require("../model/captain.model");
const blacklistTokenModel = require("../model/blacklistToken.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  // Check if the token is blacklisted
  const blacklistedToken = await blacklistTokenModel.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }
  // Check if the token is expired
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const decodedToken = jwt.decode(token);
  if (decodedToken && decodedToken.exp < currentTime) {
    return res.status(401).json({ message: "Token has expired" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Use decoded._id or fallback to decoded.id for backward compatibility
    const userId = decoded._id || decoded.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // Check if the token is valid

    req.user = user;
    return next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "unauthorized" });
  }
};

// function to authCaptain
module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  // Check if the token is blacklisted
  const blacklistedToken = await blacklistTokenModel.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }
  // Check if the token is expired
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const decodedToken = jwt.decode(token);
  if (decodedToken && decodedToken.exp < currentTime) {
    return res.status(401).json({ message: "Token has expired" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);

    // Use decoded._id or fallback to decoded.id for backward compatibility
    const captainId = decoded._id || decoded.id;

    // Find the captain by ID
    const captain = await CaptainModel.findById(captainId);

    if (!captain) {
      return res.status(401).json({ message: "captain not found" });
    }
    // Check if the token is valid
    req.captain = captain;
    return next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "unauthorized" });
  }
};
