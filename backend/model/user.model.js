const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      required: true,
      type: "string",
    },
    lastName: {
      type: "string",
      required: true,
    },
  },

  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    required: true,
    type: "string",

    select: false,
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
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET
  );
  return token;
};
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};
userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
