const express = require('express');
const controller = require('../controllers/placesController');
const { asyncHandler } = require('../utils/asyncHandler');

const placesRouter = express.Router();
placesRouter.get('/search', asyncHandler(controller.searchPlaces));
placesRouter.get('/details/:placeId', asyncHandler(controller.getPlaceDetails));
module.exports = { placesRouter };
