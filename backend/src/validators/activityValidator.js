const { z } = require('zod');

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected date in YYYY-MM-DD format');
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected time in HH:mm format');
const nullableCost = z.preprocess(
  (value) => (value === '' || value === undefined ? null : value),
  z.coerce.number().nonnegative().nullable()
);

const activityFields = {
  name: z.string().trim().min(1).max(160),
  googlePlaceId: z.string().trim().min(1).nullable().optional(),
  address: z.string().trim().max(500).optional(),
  location: z.object({ lat: z.coerce.number().gte(-90).lte(90), lng: z.coerce.number().gte(-180).lte(180) }),
  rating: z.coerce.number().min(0).max(5).nullable().optional(),
  userRating: z.coerce.number().min(1).max(5).nullable().optional(),
  date,
  time,
  notes: z.string().max(5000).optional(),
  estimatedCost: z.coerce.number().nonnegative(),
  actualCost: nullableCost
};

const createActivitySchema = z.object(activityFields);
const updateActivitySchema = z.object(activityFields).partial();

module.exports = { createActivitySchema, updateActivitySchema };
