const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { body, query } = require("express-validator");

// Route to get fare estimate
router.get(
  "/get-fare",
  authMiddleware.authUser,
  [
    query("pickup")
      .isLength({ min: 5 })
      .withMessage("Pickup location must be at least 5 characters long"),
    query("destination")
      .isLength({ min: 5 })
      .withMessage("Destination location must be at least 5 characters long"),
  ],
  rideController.getFare
);

// Route to create a new ride
router.post(
  "/create",
  authMiddleware.authUser,
  [
    body("pickup")
      .isLength({ min: 5 })
      .withMessage("Pickup location must be at least 5 characters long"),
    body("destination")
      .isLength({ min: 5 })
      .withMessage("Destination location must be at least 5 characters long"),
    body("vehicleType")
      .isIn(["auto", "car", "bike", "van"])
      .withMessage("Vehicle type must be either car, bike, or van"),
  ],

  rideController.createRide
);

//export the router
module.exports = router;
