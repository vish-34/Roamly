const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDatabase() {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured before starting the API.');
  }

  await mongoose.connect(env.MONGODB_URI);
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
}

module.exports = { connectDatabase };
