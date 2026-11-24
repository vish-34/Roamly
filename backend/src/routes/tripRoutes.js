const express = require('express');
const controller = require('../controllers/tripController');
const { validate } = require('../middleware/validate');
const { createTripSchema, updateTripSchema } = require('../validators/tripValidator');
const { asyncHandler } = require('../utils/asyncHandler');

const tripRouter = express.Router();

tripRouter
  .route('/')
  .get(asyncHandler(controller.listTrips))
  .post(validate(createTripSchema), asyncHandler(controller.createTrip));

tripRouter
  .route('/:id')
  .get(asyncHandler(controller.getTrip))
  .put(validate(updateTripSchema), asyncHandler(controller.updateTrip))
  .delete(asyncHandler(controller.deleteTrip));

module.exports = { tripRouter };
