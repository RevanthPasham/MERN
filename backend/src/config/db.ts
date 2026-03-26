import dns from "node:dns";
import { Sequelize } from "sequelize";
import pg from "pg";

/**
 * Must not throw at module load — Vercel loads this file before env is guaranteed
 * (e.g. preview deploys without env). Missing URL is handled in connectDatabaseForScripts / seed.
 */
const rawUrl = process.env.DATABASE_URL;
const DATABASE_URL =
  typeof rawUrl === "string" && rawUrl.trim().length > 0
    ? rawUrl.trim()
    : "postgresql://invalid:invalid@127.0.0.1:5432/invalid";

export function isDatabaseConfigured(): boolean {
  return Boolean(typeof rawUrl === "string" && rawUrl.trim().length > 0);
}

function dialectOptionsForUrl(urlString: string): { ssl?: { require: boolean; rejectUnauthorized: boolean } } {
  try {
    const host = new URL(urlString).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") {
      return {};
    }
  } catch {
    // ignore parse errors
  }
  return {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  /** Required so Vercel/serverless bundles include `pg` (dynamic require alone can be tree-shaken out). */
  dialectModule: pg,
  logging: false,
  dialectOptions: dialectOptionsForUrl(DATABASE_URL),
});

/** In-memory associations only; runs synchronously right before the first real DB connection (any query path). */
sequelize.addHook("beforeConnect", () => {
  // Lazy require avoids circular import with models while keeping startup free of DB work.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { associate } = require("../db/models") as { associate: () => void };
  associate();
});
