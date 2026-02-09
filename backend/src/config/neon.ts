import dotenv from "dotenv";
dotenv.config();        // ← THIS LINE WAS MISSING

import { neon } from "@neondatabase/serverless";

if (!process.env.NEON_DATABASE_URL) {
  throw new Error("DATABASE_URL missing in .env");
}

export const sql = neon(process.env.NEON_DATABASE_URL);
