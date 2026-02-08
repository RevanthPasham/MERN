import { neon } from "@neondatabase/serverless";

if (!process.env.NEON_DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

export const sql = neon(process.env.DATABASE_URL);
