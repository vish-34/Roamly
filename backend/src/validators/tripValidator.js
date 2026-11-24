const { z } = require('zod');

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected date in YYYY-MM-DD format');

const tripFields = {
  name: z.string().trim().min(1).max(120),
  destination: z.string().trim().min(1).max(160),
  startDate: date,
  endDate: date,
  totalBudget: z.coerce.number().nonnegative(),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase())
};

const createTripSchema = z.object(tripFields).refine((trip) => trip.endDate >= trip.startDate, {
  message: 'endDate must not be before startDate',
  path: ['endDate']
});

const updateTripSchema = z.object(tripFields).partial();

module.exports = { createTripSchema, updateTripSchema };
