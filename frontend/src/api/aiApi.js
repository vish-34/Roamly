import apiClient from './apiClient';

export const placesApi = {
  searchPlaces: (query, destination = '') => 
    apiClient.get('/places/search', { params: { query, destination } }),
  getPlaceDetails: (placeId) => 
    apiClient.get(`/places/details/${placeId}`),
};

export const aiApi = {
  generateItinerary: (payload) => 
    apiClient.post('/ai/generate-itinerary', payload),
  chatAssistant: (payload) => 
    apiClient.post('/ai/chat', payload),
};
