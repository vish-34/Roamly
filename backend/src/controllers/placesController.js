const { success } = require('../utils/apiResponse');
const placesService = require('../services/placesService');

async function searchPlaces(req, res) {
  const query = req.query.query?.trim();
  if (!query) { const error = new Error('query is required'); error.statusCode = 400; throw error; }
  const places = await placesService.searchPlaces(query, req.query.destination?.trim());
  res.json(success(places));
}

async function getPlaceDetails(req, res) {
  const place = await placesService.getPlaceDetails(req.params.placeId);
  res.json(success(place));
}

module.exports = { searchPlaces, getPlaceDetails };
