const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

// Function to register a new user
module.exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
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

// Function to get all users
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Function to get a user by ID
module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Function to update a user by ID
module.exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, address } = req.body;
    const user = await userService.updateUserById(
      id,
      fullName,
      email,
      password,
      address
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Function to delete a user by ID
module.exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.deleteUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Function to get all deleted users
module.exports.getDeletedUsers = async (req, res) => {
  try {
    const users = await userService.getDeletedUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Function to get all users with a specific role
module.exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await userService.getUsersByRole(role);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
