const axios = require('axios');
const { env } = require('../config/env');

const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getKey(key) {
  const item = cache.get(key);
  if (item && item.expiresAt > Date.now()) return item.value;
  cache.delete(key);
  return undefined;
}

function setKey(key, value) {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}

function requireGeoapify() {
  if (!env.GEOAPIFY_API_KEY) {
    const error = new Error('GEOAPIFY_API_KEY is not configured'); error.statusCode = 503; throw error;
  }
}

function normalizePlace(result) {
  return {
    placeId: result.place_id,
    name: result.name || result.formatted,
    address: result.formatted || '',
    location: { lat: result.lat, lng: result.lon },
    categories: result.categories || [],
    rating: null
  };
}

async function searchPlaces(query, destination = '') {
  requireGeoapify();
  const searchText = [query, destination].filter(Boolean).join(', ');
  const cacheKey = `search:${searchText.toLowerCase()}`;
  const cached = getKey(cacheKey);
  if (cached) return cached;
  const { data } = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
    params: { text: searchText, type: 'amenity', limit: 10, format: 'json', apiKey: env.GEOAPIFY_API_KEY },
    timeout: 10000
  });
  const places = (data.results || []).map(normalizePlace);
  places.forEach((place) => setKey(`details:${place.placeId}`, place));
  return setKey(cacheKey, places);
}

async function getPlaceDetails(placeId) {
  requireGeoapify();
  const cached = getKey(`details:${placeId}`);
  if (cached) return cached;
  const { data } = await axios.get('https://api.geoapify.com/v2/place-details', {
    params: { id: placeId, apiKey: env.GEOAPIFY_API_KEY }, timeout: 10000
  });
  const feature = data.features?.[0];
  if (!feature) { const error = new Error('Place not found'); error.statusCode = 404; throw error; }
  const properties = feature.properties || {};
  const [lng, lat] = feature.geometry?.coordinates || [];
  return setKey(`details:${placeId}`, {
    placeId: properties.place_id || placeId,
    name: properties.name || properties.formatted,
    address: properties.formatted || '',
    location: { lat, lng },
    categories: properties.categories || [],
    rating: null
  });
}

module.exports = { searchPlaces, getPlaceDetails };
