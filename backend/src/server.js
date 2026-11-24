require('dotenv').config();

const { app } = require('./app');
const { env } = require('./config/env');
const { connectDatabase } = require('./config/db');

async function startServer() {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`Roamly API listening on port ${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start Roamly API', error);
  process.exit(1);
});
