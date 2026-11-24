const express = require('express');
const controller = require('../controllers/tripController');
const { validate } = require('../middleware/validate');
const { createTripSchema, updateTripSchema } = require('../validators/tripValidator');

const tripRouter = express.Router();

tripRouter.route('/').get(controller.listTrips).post(validate(createTripSchema), controller.createTrip);
tripRouter.route('/:id').get(controller.getTrip).put(validate(updateTripSchema), controller.updateTrip).delete(controller.deleteTrip);

module.exports = { tripRouter };
