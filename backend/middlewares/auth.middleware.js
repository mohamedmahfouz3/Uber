const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  // Check if the token is blacklisted
  const blacklistedToken = await userModel.findOne({ token });
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

    // Find the user by ID
    const user = await userModel.findById(decoded._id);

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
