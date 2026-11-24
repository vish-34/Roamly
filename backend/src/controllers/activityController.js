const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const { serializeTrip } = require('../services/tripService');
const { success } = require('../utils/apiResponse');

async function findTrip(tripId) {
  if (!mongoose.isObjectIdOrHexString(tripId)) {
    const error = new Error('Invalid trip id');
    error.statusCode = 400;
    throw error;
  }
  const trip = await Trip.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  return trip;
}

function findActivity(trip, activityId) {
  if (!mongoose.isObjectIdOrHexString(activityId)) {
    const error = new Error('Invalid activity id');
    error.statusCode = 400;
    throw error;
  }
  const activity = trip.activities.id(activityId);
  if (!activity) {
    const error = new Error('Activity not found');
    error.statusCode = 404;
    throw error;
  }
  return activity;
}

async function createActivity(req, res) {
  const trip = await findTrip(req.params.tripId);
  trip.activities.push(req.body);
  await trip.save();
  const serializedTrip = serializeTrip(trip);
  const activity = serializedTrip.activities.find((item) => item._id.toString() === trip.activities.at(-1)._id.toString());
  res.status(201).json(success({ activity, budget: serializedTrip.budget }, 'Activity created successfully'));
}

async function updateActivity(req, res) {
  const trip = await findTrip(req.params.tripId);
  const activity = findActivity(trip, req.params.activityId);
  activity.set(req.body);
  await trip.save();
  const serializedTrip = serializeTrip(trip);
  const updatedActivity = serializedTrip.activities.find((item) => item._id.toString() === activity._id.toString());
  res.json(success({ activity: updatedActivity, budget: serializedTrip.budget }, 'Activity updated successfully'));
}

async function deleteActivity(req, res) {
  const trip = await findTrip(req.params.tripId);
  const activity = findActivity(trip, req.params.activityId);
  activity.deleteOne();
  await trip.save();
  const serializedTrip = serializeTrip(trip);
  res.json(success({ id: req.params.activityId, budget: serializedTrip.budget }, 'Activity deleted successfully'));
}

module.exports = { createActivity, updateActivity, deleteActivity };
