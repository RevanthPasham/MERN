import { Sequelize } from "sequelize";

const DATABASE_URL =
  process.env.DATABASE_URL && typeof process.env.DATABASE_URL === "string"
    ? process.env.DATABASE_URL.trim()
    : "";

// Avoid throwing at module import time on serverless cold starts.
// If DATABASE_URL is missing, initModels().authenticate() will fail and api/index.ts
// will return a controlled 503 JSON response instead of FUNCTION_INVOCATION_FAILED.
const FALLBACK_DATABASE_URL = "postgresql://invalid:invalid@localhost:5432/invalid";

export const sequelize = new Sequelize(DATABASE_URL || FALLBACK_DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  pool: {
    max: process.env.VERCEL ? 1 : 5,
    min: 0,
    acquire: 10000,
    idle: 10000,
  },
});