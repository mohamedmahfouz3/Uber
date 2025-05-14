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

module.exports.updateUserById = async (
  id,
  fullName,
  email,
  password,
  address
) => {
  const user = await userModel.findById(id);
  if (!user) {
    return null;
  }
  if (fullName) {
    user.fullName = fullName;
  }
  if (email) {
    user.email = email;
  }
  if (password) {
    user.password = password;
  }
  if (address) {
    user.address = address;
  }
  await user.save();
  return user;
};

module.exports.deleteUserById = async (id) => {
  const user = await userModel.findByIdAndDelete(id);
  return user;
};

module.exports.getDeletedUsers = async () => {
  const deletedUsers = await userModel.find({ isDeleted: true });
  return deletedUsers;
};

module.exports.getUsersByRole = async (role) => {
  const users = await userModel.find({ role });
  return users;
};
