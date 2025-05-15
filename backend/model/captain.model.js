const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      trim: true, // Trim spaces for consistency
      minlength: 3, // Minimum length for first name
    },
    lastName: {
      type: String,
      required: true,
      trim: true, // Trim spaces for consistency
      minlength: 3, // Minimum length for last name
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Trim spaces for consistency
    lowercase: true, // Ensure email is stored in lowercase
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ], // Regex for email validation
  },
  password: {
    type: String,
    required: true,
    select: false, // Exclude password by default when querying
    minlength: 8, // Minimum length for password
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "inactive",
  },
  address: {
    type: String,

    trim: true, // Trim spaces for consistency
  },
  phone: {
    type: String,

    trim: true, // Trim spaces for consistency
    match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"], // Regex for phone number validation
  },

  dateOfBirth: {
    type: Date,
  },
  vehicle: {
    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "bike", "truck", "auto"], // Enum for vehicle types
    },
    vehicleName: {
      type: String,
      required: true,
      trim: true, // Trim spaces for consistency
      minlength: 3, // Minimum length for vehicle name
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true, // Trim spaces for consistency
      minlength: 3, // Minimum length for vehicle number
    },
    vehicleModel: {
      type: String,
      required: true,
      trim: true, // Trim spaces for consistency
      minlength: 3, // Minimum length for vehicle model
    },
    vehicleColor: {
      type: String,
      required: true,
      trim: true, // Trim spaces for consistency
      minlength: 3, // Minimum length for vehicle color
    },
    vehiclePlate: {
      type: String,
      required: true,
      trim: true, // Trim spaces for consistency
      minlength: 3, // Minimum length for vehicle plate
    },
    vehicleYear: {
      type: Number,
      required: true,
      min: 1900, // Minimum year
      max: new Date().getFullYear(), // Maximum year is the current year
    },
    vehicleCapacity: {
      type: Number,
      required: true,
      min: 1, // Minimum capacity
    },
  },
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

// Method to hash password
captainSchema.statics.hashPassword = async function (password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
// Method to compare password
captainSchema.statics.comparePassword = async function (
  password,
  hashedPassword
) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const CaptainModel = mongoose.model("Captain", captainSchema);
module.exports = CaptainModel;
