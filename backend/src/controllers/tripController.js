const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const { success } = require('../utils/apiResponse');
const { serializeTrip } = require('../services/tripService');

function requireObjectId(id) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    const error = new Error('Invalid trip id');
    error.statusCode = 400;
    throw error;
  }
}

async function listTrips(req, res) {
  const trips = await Trip.find().sort({ updatedAt: -1 });
  res.json(success(trips.map(serializeTrip)));
}

async function createTrip(req, res) {
  const trip = await Trip.create(req.body);
  res.status(201).json(success(serializeTrip(trip), 'Trip created successfully'));
}

async function getTrip(req, res) {
  requireObjectId(req.params.id);
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  res.json(success(serializeTrip(trip)));
}

async function updateTrip(req, res) {
  requireObjectId(req.params.id);
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  res.json(success(serializeTrip(trip), 'Trip updated successfully'));
}

async function deleteTrip(req, res) {
  requireObjectId(req.params.id);
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json(success({ id: trip.id }, 'Trip deleted successfully'));
}

module.exports = { listTrips, createTrip, getTrip, updateTrip, deleteTrip };
