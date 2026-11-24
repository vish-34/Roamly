const { z } = require('zod');

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1).optional(),
  GROQ_API_KEY: z.string().min(1).optional(),
  GOOGLE_MAPS_API_KEY: z.string().min(1).optional(),
  CORS_ORIGIN: z.string().url().default('http://localhost:5173')
});

const env = environmentSchema.parse(process.env);

module.exports = { env };
