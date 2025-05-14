const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.createUser = async (userData) => {
  const { fullName, email, password, address } = userData;
  if (!fullName || !email || !password || !address) {
    throw new Error("All fields are required");
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  //Hash the password using bcrypt
  // Create a new user

  // Remove explicit hashing here, let pre-save middleware handle it
  const newUser = userModel.create({
    fullName: {
      firstName: fullName.firstName,
      lastName: fullName.lastName,
    },
    email,
    password,
    address,
  });
  return newUser;
};

module.exports.getAllUsers = async () => {
  return await userModel.find({ isDeleted: false });
};

module.exports.getUserById = async (id) => {
  return await userModel.findOne({ _id: id, isDeleted: false });
};

module.exports.updateUserById = async (id, updateData) => {
  return await userModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { new: true }
  );
};

module.exports.deleteUserById = async (id) => {
  // Soft delete by setting isDeleted to true
  return await userModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
};

module.exports.getDeletedUsers = async () => {
  return await userModel.find({ isDeleted: true });
};

module.exports.getUsersByRole = async (role) => {
  if (role === "admin") {
    return await userModel.find({ isAdmin: true, isDeleted: false });
  } else if (role === "user") {
    return await userModel.find({ isAdmin: false, isDeleted: false });
  } else {
    // If role is not recognized, return empty array
    return [];
  }
};
