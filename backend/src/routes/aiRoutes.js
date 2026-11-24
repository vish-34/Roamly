const express = require('express');
const controller = require('../controllers/aiController');
const { validate } = require('../middleware/validate');
const { generateItinerarySchema, chatSchema } = require('../validators/aiValidator');
const { asyncHandler } = require('../utils/asyncHandler');
const aiRouter = express.Router();
aiRouter.post('/generate-itinerary', validate(generateItinerarySchema), asyncHandler(controller.generateItinerary));
aiRouter.post('/chat', validate(chatSchema), asyncHandler(controller.chat));
module.exports = { aiRouter };
