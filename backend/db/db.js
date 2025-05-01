const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI; // or your hardcoded string
    console.log("MongoDB URI:", mongoURI); // Debugging line
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToDb;
