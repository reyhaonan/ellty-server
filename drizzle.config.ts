// server/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "./src/models",
  out: "./drizzle",
  dialect: "postgresql",
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
