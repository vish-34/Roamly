import apiClient from './apiClient';

export const documentApi = {
  uploadDocument: (tripId, file) => {
    const formData = new FormData();
    formData.append('document', file);
    return apiClient.post(`/trips/${tripId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getDocumentDownloadUrl: (tripId, fileId) => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    return `${base}/trips/${tripId}/documents/${fileId}/download`;
  },

  deleteDocument: (tripId, fileId) => 
    apiClient.delete(`/trips/${tripId}/documents/${fileId}`),
};
