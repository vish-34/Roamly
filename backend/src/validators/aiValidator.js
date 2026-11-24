const { z } = require('zod');

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const generatedActivitySchema = z.object({
  name: z.string().min(1), address: z.string().default(''), time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  estimatedCost: z.number().nonnegative(), notes: z.string().default('')
});
const generatedItinerarySchema = z.object({
  summary: z.string().min(1),
  days: z.array(z.object({ dayNumber: z.number().int().positive(), title: z.string().min(1), activities: z.array(generatedActivitySchema).min(1) })).min(1)
});
const generateItinerarySchema = z.object({
  destination: z.string().trim().min(1), startDate: date, endDate: date, budget: z.coerce.number().nonnegative(),
  interests: z.string().trim().min(1), travelStyle: z.string().trim().min(1), days: z.coerce.number().int().min(1).max(14)
});
const chatSchema = z.object({ tripId: z.string().optional(), message: z.string().trim().min(1).max(4000) });
module.exports = { generateItinerarySchema, generatedItinerarySchema, chatSchema };
