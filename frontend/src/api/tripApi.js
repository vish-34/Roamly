import apiClient from './apiClient';

export const tripApi = {
  // Trip CRUD
  getAllTrips: () => apiClient.get('/trips'),
  getTripById: (id) => apiClient.get(`/trips/${id}`),
  createTrip: (data) => apiClient.post('/trips', data),
  updateTrip: (id, data) => apiClient.put(`/trips/${id}`, data),
  deleteTrip: (id) => apiClient.delete(`/trips/${id}`),

  // Activity CRUD
  addActivity: (tripId, data) => apiClient.post(`/trips/${tripId}/activities`, data),
  updateActivity: (tripId, activityId, data) => 
    apiClient.put(`/trips/${tripId}/activities/${activityId}`, data),
  deleteActivity: (tripId, activityId) => 
    apiClient.delete(`/trips/${tripId}/activities/${activityId}`),
};
