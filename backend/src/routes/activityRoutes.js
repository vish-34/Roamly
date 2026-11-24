const express = require('express');
const controller = require('../controllers/activityController');
const { validate } = require('../middleware/validate');
const { createActivitySchema, updateActivitySchema } = require('../validators/activityValidator');

const activityRouter = express.Router({ mergeParams: true });

activityRouter
  .route('/')
  .post(validate(createActivitySchema), controller.createActivity);

activityRouter
  .route('/:activityId')
  .put(validate(updateActivitySchema), controller.updateActivity)
  .delete(controller.deleteActivity);

module.exports = { activityRouter };
