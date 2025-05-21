const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");

module.exports.getAddressCoordinates = async (req, res) => {
  // Validate request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Extract address from query parameters
  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const coordinates = await mapService.getAddressCoordinates(address);
    return res.status(200).json(coordinates);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// getDistanceTime function

module.exports.getDistanceTime = async (req, res) => {
  // Validate request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Extract origin and destination from query parameters
  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res
      .status(400)
      .json({ error: "Origin and destination are required" });
  }
  try {
    const distanceTime = await mapService.getDistanceTime(origin, destination);
    return res.status(200).json(distanceTime);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// getAutoCompleteSuggestions function

module.exports.getAutoCompleteSuggestions = async (req, res) => {
  // Validate request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Extract input from query parameters
  const { input } = req.query;
  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }
  try {
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    return res.status(200).json(suggestions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
