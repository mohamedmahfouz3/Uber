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
      return res.status(422).json({ errors: errors.array() });
    }
    const { fullName, email, password, address } = req.body;
    // hash the password
    const hashedPassword = await userModel.hashPassword(password);
    // check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // create a new user
    const newUser = await userService.createUser({
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName,
      },
      email,
      password: hashedPassword,
      address,
    });
    // save the user to the database
    await newUser.save();
    // generate a token
    const token = newUser.generateAuthToken();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        address: newUser.address,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Function to login a user
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = await userService.loginUser(email, password);

    return res.status(200).json(user);
  } catch (error) {
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
    return res.status(200).json(user);
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
