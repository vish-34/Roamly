require('dotenv').config();
const { z } = require('zod');

const optionalSecret = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().min(1).optional()
);

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: optionalSecret,
  GROQ_API_KEY: optionalSecret,
  GROQ_MODEL: z.string().min(1).default('openai/gpt-oss-20b'),
  GEOAPIFY_API_KEY: optionalSecret,
  CORS_ORIGIN: z.string().url().default('http://localhost:5173')
});

const env = environmentSchema.parse(process.env);

module.exports = { env };
