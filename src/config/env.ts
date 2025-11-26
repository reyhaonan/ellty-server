import "dotenv/config";
import { z } from "zod";

export const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(8000),
  SESSION_SECRET: z.string().min(1, "SESSION_SECRET cannot be empty"),
  NODE_ENV: z.string().default("development"),
  CORS_ORIGIN: z.string(),
});

export const env = EnvSchema.parse(process.env);
