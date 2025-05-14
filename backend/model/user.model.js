const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      trim: true, // Trim spaces for consistency
    },
    lastName: {
      type: String,
      required: true,
      trim: true, // Trim spaces for consistency
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Trim spaces for consistency
    lowercase: true, // Ensure email is stored in lowercase
  },
  password: {
    type: String,
    required: true,
    select: false, // Exclude password by default when querying
  },
  socketId: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
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

// Method to generate an authentication token (JWT)
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "24h" } // Token expiration time
  );
  return token;
};
// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Refresh token expiration time
  );
  return refreshToken;
};
// Method to generate a verification token
userSchema.methods.generateVerificationToken = function () {
  const verificationToken = jwt.sign(
    { _id: this._id, isVerified: this.isVerified },
    process.env.JWT_VERIFICATION_SECRET,
    { expiresIn: "1d" } // Verification token expiration time
  );
  return verificationToken;
};
// Method to generate a password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const passwordResetToken = jwt.sign(
    { _id: this._id, isVerified: this.isVerified },
    process.env.JWT_PASSWORD_RESET_SECRET,
    { expiresIn: "1h" } // Password reset token expiration time
  );
  return passwordResetToken;
};
// Method to generate a verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const emailVerificationToken = jwt.sign(
    { _id: this._id, isVerified: this.isVerified },
    process.env.JWT_EMAIL_VERIFICATION_SECRET,
    { expiresIn: "1d" } // Email verification token expiration time
  );
  return emailVerificationToken;
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
// Function to compare password with the stored hash
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);
// Export the user model
module.exports = userModel;
