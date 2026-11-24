const { success } = require('../utils/apiResponse');
const aiService = require('../services/aiService');
async function generateItinerary(req, res) { res.json(success(await aiService.generateItinerary(req.body), 'Itinerary generated successfully')); }
async function chat(req, res) { res.json(success(await aiService.chat(req.body))); }
module.exports = { generateItinerary, chat };
