const express = require('express');
const controller = require('../controllers/activityController');
const { validate } = require('../middleware/validate');
const { createActivitySchema, updateActivitySchema } = require('../validators/activityValidator');
const { asyncHandler } = require('../utils/asyncHandler');

const activityRouter = express.Router({ mergeParams: true });

activityRouter
  .route('/')
  .post(validate(createActivitySchema), asyncHandler(controller.createActivity));

activityRouter
  .route('/:activityId')
  .put(validate(updateActivitySchema), asyncHandler(controller.updateActivity))
  .delete(asyncHandler(controller.deleteActivity));

module.exports = { activityRouter };
