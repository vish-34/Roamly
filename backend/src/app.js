const cors = require('cors');
const express = require('express');
const { env } = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiRouter } = require('./routes');

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use('/api/v1', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
