const axios = require("axios");

module.exports.getAddressCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

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
      throw new Error("Unable to get coordinates");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new Error("Error fetching coordinates");
  }
};
