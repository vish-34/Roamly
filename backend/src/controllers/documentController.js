const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const { success } = require('../utils/apiResponse');
const { getGridFSBucket } = require('../config/db');
const documentService = require('../services/documentService');

async function findTrip(tripId) {
  if (!mongoose.isObjectIdOrHexString(tripId)) {
    const error = new Error('Invalid trip id'); error.statusCode = 400; throw error;
  }
  const trip = await Trip.findById(tripId);
  if (!trip) { const error = new Error('Trip not found'); error.statusCode = 404; throw error; }
  return trip;
}

async function uploadDocument(req, res) {
  const trip = await findTrip(req.params.tripId);
  const document = await documentService.uploadDocument(req.file, trip._id);
  trip.documents.push(document);
  await trip.save();
  res.status(201).json(success(document, 'Document uploaded successfully'));
}

async function downloadDocument(req, res) {
  const trip = await findTrip(req.params.tripId);
  const document = trip.documents.find((item) => item.fileId.toString() === req.params.fileId);
  if (!document) { const error = new Error('Document not found'); error.statusCode = 404; throw error; }
  res.setHeader('Content-Type', document.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(document.originalName)}"`);
  getGridFSBucket().openDownloadStream(document.fileId).on('error', (error) => {
    if (!res.headersSent) return res.status(404).json({ success: false, message: 'Stored file not found' });
    return res.destroy(error);
  }).pipe(res);
}

async function deleteDocument(req, res) {
  const trip = await findTrip(req.params.tripId);
  const document = trip.documents.find((item) => item.fileId.toString() === req.params.fileId);
  if (!document) { const error = new Error('Document not found'); error.statusCode = 404; throw error; }
  await documentService.deleteDocument(document.fileId);
  document.deleteOne();
  await trip.save();
  res.json(success({ id: req.params.fileId }, 'Document deleted successfully'));
}

module.exports = { uploadDocument, downloadDocument, deleteDocument };
