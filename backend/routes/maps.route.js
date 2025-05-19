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

module.exports = router;
