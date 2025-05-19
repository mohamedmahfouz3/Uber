const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenSchema = require("../model/blacklistToken.model");

// Function to register a new user
module.exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log("Validation errors:", errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, address } = req.body;

    // hash password

    const hashedPassword = await userModel.hashPassword(password);
    console.log("Hashed password:", hashedPassword);

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = await userService.createUser({
      fullName,
      email,
      password: hashedPassword,
      address,
    });

    // Generate a token
    const token = newUser.generateAuthToken();
    console.log("Generated token:", token);
    // Set the token in the response header
    res.setHeader("Authorization", `Bearer ${token}`);
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    // Return the user data and token
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        address: newUser.address,
        password: newUser.password,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Function to login a user
module.exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log("Login attempt for email:", email);
    // Check if the user exists

    // Find the user and explicitly include the password field
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //compare the password
    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);
    // If the password does not match, return an error
    if (!isMatch) {
      console.log("Invalid password for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a token
    const token = user.generateAuthToken();

    // Set the token in the response header
    res.setHeader("Authorization", `Bearer ${token}`);
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Function to get user profile
module.exports.getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// Function to logout a user
module.exports.logoutUser = async (req, res) => {
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
