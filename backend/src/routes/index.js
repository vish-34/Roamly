const express = require('express');
const { success } = require('../utils/apiResponse');
const { tripRouter } = require('./tripRoutes');
const { activityRouter } = require('./activityRoutes');

const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.status(200).json(success({ status: 'ok' }, 'Roamly API is healthy'));
});

apiRouter.use('/trips', tripRouter);
apiRouter.use('/trips/:tripId/activities', activityRouter);

module.exports = { apiRouter };
