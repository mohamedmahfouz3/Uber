const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");

const getAddressCoordinates = async (req, res) => {
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

module.exports = { getAddressCoordinates };
