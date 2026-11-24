const Groq = require('groq-sdk');
const Trip = require('../models/Trip');
const { env } = require('../config/env');
const { generatedItinerarySchema } = require('../validators/aiValidator');
const { serializeTrip } = require('./tripService');
const { searchPlaces } = require('./placesService');

function getClient() {
  if (!env.GROQ_API_KEY) { const error = new Error('GROQ_API_KEY is not configured'); error.statusCode = 503; throw error; }
  return new Groq({ apiKey: env.GROQ_API_KEY });
}

async function complete(messages, responseFormat) {
  const completion = await getClient().chat.completions.create({ model: env.GROQ_MODEL, messages, temperature: 0.4, ...(responseFormat ? { response_format: responseFormat } : {}) });
  return completion.choices[0]?.message?.content || '';
}

async function generateItinerary(input) {
  const content = await complete([
    { role: 'system', content: 'You create practical travel itineraries. Return only valid JSON matching {summary:string,days:[{dayNumber:number,title:string,activities:[{name:string,address:string,time:HH:mm,estimatedCost:number,notes:string}]}]}. Do not include coordinates.' },
    { role: 'user', content: JSON.stringify(input) }
  ], { type: 'json_object' });
  let itinerary;
  try { itinerary = generatedItinerarySchema.parse(JSON.parse(content)); } catch { const error = new Error('AI returned an invalid itinerary format'); error.statusCode = 502; throw error; }

  for (const day of itinerary.days) {
    for (const activity of day.activities) {
      const [place] = await searchPlaces(`${activity.name} ${activity.address}`, input.destination);
      if (!place) { const error = new Error(`Could not verify the location for ${activity.name}`); error.statusCode = 422; throw error; }
      activity.address = place.address;
      activity.location = place.location;
      activity.googlePlaceId = place.placeId;
    }
  }
  return itinerary;
}

async function chat({ tripId, message }) {
  let context = 'No saved trip context was supplied.';
  if (tripId) {
    const trip = await Trip.findById(tripId);
    if (!trip) { const error = new Error('Trip not found'); error.statusCode = 404; throw error; }
    const serialized = serializeTrip(trip);
    context = JSON.stringify({ destination: serialized.destination, dates: [serialized.startDate, serialized.endDate], budget: serialized.budget, activities: serialized.activities.map(({ name, date, time, estimatedCost, actualCost }) => ({ name, date, time, estimatedCost, actualCost })) });
  }
  const reply = await complete([{ role: 'system', content: `You are Roamly's concise travel co-pilot. Use this live trip context: ${context}` }, { role: 'user', content: message }]);
  return { reply };
}
module.exports = { generateItinerary, chat };
