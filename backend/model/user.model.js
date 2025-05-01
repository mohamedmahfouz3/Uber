const mongoose = require("mongoose");

const bycrpt = require("bycrpt");
const jwt = require("jwt");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      required: true,
      type: "string",
      minlength: [3, "first name must be at least 3 characters long"],
    },
    lastName: {
      type: "string",
      required: true,
      minlength: [3, "last name must be at least 3 characters long"],
    },
  },

  email: {
    type: "string",
    required: true,
    unique: true,
    minlength: [5, "email must be at least 5 characters long"],
  },
  password: {
    required: true,
    type: "string",
    minlength: [5, "password must be at least 5 characters long"],
  },
  socketId: {
    type: "string",
  },
  isVerified: {
    type: "boolean",
    default: false,
  },
  isAdmin: {
    type: "boolean",
    default: false,
  },
  isBanned: {
    type: "boolean",
    default: false,
  },
  isDeleted: {
    type: "boolean",
    default: false,
  },
  isActive: {
    type: "boolean",
    default: true,
  },
  createdAt: {
    type: "date",
    default: Date.now,
  },
  updatedAt: {
    type: "date",
    default: Date.now,
  },
});
module.exports = mongoose.model("User", userSchema);
