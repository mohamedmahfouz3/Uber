const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { body } = require("express-validator");

// Route to create a new ride
router.post(
  "/create",
  [
    body("pickupLocation")
      .isLength({ min: 3 })
      .withMessage("Pickup location must be at least 3 characters long"),
    body("dropOffLocation")
      .isLength({ min: 3 })
      .withMessage("Drop-off location must be at least 3 characters long"),
    body("fare").isNumeric().withMessage("Fare must be a number"),
  ],
  authMiddleware.authPassenger,
  rideController.createRide
);
/*
// Route to get all rides for a passenger
router.get(
  '/passenger/:passengerId',
  authMiddleware.authPassenger,
  rideController.getAllRidesForPassenger
);
// Route to get all rides for a driver
router.get(
  '/driver/:driverId',
  authMiddleware.authDriver,
  rideController.getAllRidesForDriver
);
// Route to update ride status
router.put(
  '/update/:rideId',
  [
    body('status')
      .isIn(['pending', 'in-progress', 'completed', 'canceled'])
      .withMessage('Invalid status'),
  ],
  authMiddleware.authDriver,
  rideController.updateRideStatus
);
// Route to delete a ride  
*/
