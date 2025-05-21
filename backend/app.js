const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const captainRoutes = require("./routes/captain.routes");
const mapRoutes = require("./routes/maps.route");
const rideRoutes = require("./routes/ride.routes");

connectToDb();
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapRoutes);
app.use("/rides", rideRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the ride sharing app");
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

module.exports = app;
