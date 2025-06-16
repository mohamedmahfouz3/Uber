const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const mapController = require("../controllers/map.controller");
console.log("mapController:", mapController);
const { query } = require("express-validator");

// Route to get coordinates for a given address

router.get(
  "/coordinates",
  [
    query("address")
      .isLength({ min: 3 })
      .withMessage("Address must be at least 3 characters long"),
  ],
  authMiddleware.authUser,
  mapController.getAddressCoordinates
);

// Route to get distance and time between two locations
router.get(
  "/distance-time",
  [
    query("origin")
      .isLength({ min: 3 })
      .withMessage("Origin must be at least 3 characters long"),
    query("destination")
      .isLength({ min: 3 })
      .withMessage("Destination must be at least 3 characters long"),
  ],
  authMiddleware.authUser,
  mapController.getDistanceTime
);
// Route to get autocomplete suggestions
router.get(
  "/autocomplete",
  [
    query("input")
      .isLength({ min: 3 })
      .withMessage("Input must be at least 3 characters long"),
  ],
  authMiddleware.authUser,
  mapController.getAutoCompleteSuggestions
);

module.exports = router;
