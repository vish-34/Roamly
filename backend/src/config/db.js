const dns = require('node:dns');
const mongoose = require('mongoose');
const { env } = require('./env');

// Resolve Windows DNS SRV lookup issues for MongoDB Atlas clusters
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // fallback to system default
}

async function connectDatabase() {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured before starting the API.');
  }

  await mongoose.connect(env.MONGODB_URI);
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
}

function getGridFSBucket() {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    const error = new Error('Database connection is not available');
    error.statusCode = 503;
    throw error;
  }
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'travel_docs' });
}

module.exports = { connectDatabase, getGridFSBucket };
