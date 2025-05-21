const axios = require("axios");

module.exports.getAddressCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key is missing.");
    throw new Error("Google Maps API key is missing.");
  }

  console.log("Using Google Maps API key.");

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.error("Google Maps API error response:", response.data);
      throw new Error(
        `Unable to get coordinates: ${
          response.data.error_message || response.data.status
        }`
      );
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new Error("Error fetching coordinates");
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  // Validate input
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key is missing.");
    throw new Error("Google Maps API key is missing.");
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const element = response.data.rows[0].elements[0];
      return {
        distance: element.distance.text,
        duration: element.duration.text,
      };
    } else {
      console.error("Google Maps API error response:", response.data);
      throw new Error(
        `Unable to get distance and time: ${
          response.data.error_message || response.data.status
        }`
      );
    }
  } catch (error) {
    console.error("Error fetching distance and time:", error);
    throw new Error("Error fetching distance and time");
  }
};

// getAutoCompleteSuggestions function
module.exports.getAutoCompleteSuggestions = async (input) => {
  // Validate input
  if (!input) {
    throw new Error("Input is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key is missing.");
    throw new Error("Google Maps API key is missing.");
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.predictions.map((prediction) => ({
        description: prediction.description,
        placeId: prediction.place_id,
      }));
    } else {
      console.error("Google Maps API error response:", response.data);
      throw new Error(
        `Unable to get autocomplete suggestions: ${
          response.data.error_message || response.data.status
        }`
      );
    }
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    throw new Error("Error fetching autocomplete suggestions");
  }
};
