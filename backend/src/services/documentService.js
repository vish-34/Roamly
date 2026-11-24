const mongoose = require('mongoose');
const { getGridFSBucket } = require('../config/db');

function asObjectId(id, label = 'file id') {
  if (!mongoose.isObjectIdOrHexString(id)) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
  return new mongoose.Types.ObjectId(id);
}

function uploadDocument(file, tripId) {
  const bucket = getGridFSBucket();
  return new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
      metadata: { tripId: tripId.toString(), originalName: file.originalname, mimeType: file.mimetype, fileSize: file.size }
    });
    stream.once('error', reject);
    stream.once('finish', () => resolve({
      fileId: stream.id,
      fileName: stream.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size
    }));
    stream.end(file.buffer);
  });
}

async function deleteDocument(fileId) {
  const bucket = getGridFSBucket();
  try {
    await bucket.delete(asObjectId(fileId));
  } catch (error) {
    if (error?.code === 26) return;
    throw error;
  }
}

async function deleteTripDocuments(documents = []) {
  await Promise.all(documents.map((document) => deleteDocument(document.fileId)));
}

module.exports = { uploadDocument, deleteDocument, deleteTripDocuments, asObjectId };
