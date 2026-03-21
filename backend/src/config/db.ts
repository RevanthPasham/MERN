import { Sequelize } from "sequelize";
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL && typeof process.env.DATABASE_URL === "string"
    ? process.env.DATABASE_URL.trim()
    : "";

// Avoid throwing at module import time on serverless cold starts.
// If DATABASE_URL is missing, initModels().authenticate() will fail and api/index.ts
// will return a controlled 503 JSON response instead of FUNCTION_INVOCATION_FAILED.
const FALLBACK_DATABASE_URL = "postgresql://invalid:invalid@localhost:5432/invalid";

const resolvedUrl = DATABASE_URL || FALLBACK_DATABASE_URL;

/**
 * Local Postgres usually has SSL off. Forcing ssl.require on localhost often makes
 * the driver hang until the pool times out → SequelizeConnectionAcquireTimeoutError.
 * Hosted DBs (Neon, Supabase, RDS, etc.) need TLS — enable for non-local hosts.
 *
 * Override: DATABASE_SSL=true | false
 */
function useSslForDatabaseUrl(url: string): boolean {
  const flag = process.env.DATABASE_SSL?.toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;

  const u = url.toLowerCase();
  if (u.includes("localhost") || u.includes("127.0.0.1")) return false;
  if (/sslmode=disable/i.test(url)) return false;
  if (/sslmode=(require|verify-full|verify-ca|prefer)/i.test(url)) return true;

  return true;
}

const useSsl = useSslForDatabaseUrl(resolvedUrl);

const dialectOptions: Record<string, unknown> = {
  statement_timeout: 12000,
  query_timeout: 12000,
  connectionTimeoutMillis: 15000,
};

if (useSsl) {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false,
  };
}

export const sequelize = new Sequelize(resolvedUrl, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions,
  logging: false,
  pool: {
    max: process.env.VERCEL ? 1 : 5,
    min: 0,
    acquire: 20000,
    idle: 10000,
  },
});