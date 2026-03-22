import { Sequelize } from "sequelize";
import pg from "pg";
import * as neon from "@neondatabase/serverless";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const DATABASE_URL =
  process.env.DATABASE_URL && typeof process.env.DATABASE_URL === "string"
    ? process.env.DATABASE_URL.trim()
    : "";

/**
 * Neon often appends `channel_binding=require`. With node-pg TCP on Vercel this can
 * stall TLS handshakes and cause 300s platform timeouts. Strip it.
 */
function sanitizeDatabaseUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return url;
  }
}

const FALLBACK_DATABASE_URL = "postgresql://invalid:invalid@localhost:5432/invalid";

const resolvedUrl = sanitizeDatabaseUrl(DATABASE_URL || FALLBACK_DATABASE_URL);

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

/** Vercel serverless: plain TCP `pg` to Neon often hangs; use Neon's WebSocket driver. */
const isServerless = Boolean(process.env.VERCEL);

if (isServerless) {
  neonConfig.webSocketConstructor = ws;
  // Prefer HTTP fetch for pool queries when possible (lower latency on serverless).
  neonConfig.poolQueryViaFetch = true;
}

const dialectModule = isServerless ? (neon as unknown as typeof pg) : pg;

const dialectOptions: Record<string, unknown> = {
  statement_timeout: 12000,
  query_timeout: 12000,
  connectionTimeoutMillis: isServerless ? 12000 : 15000,
  keepAlive: true,
};

// TCP pg needs explicit TLS to Neon. Neon's serverless driver uses wss — extra ssl here can confuse.
if (useSsl && !isServerless) {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false,
  };
}

export const sequelize = new Sequelize(resolvedUrl, {
  dialect: "postgres",
  dialectModule,
  dialectOptions,
  logging: false,
  pool: {
    max: isServerless ? 1 : 5,
    min: 0,
    acquire: isServerless ? 15000 : 20000,
    idle: isServerless ? 5000 : 10000,
  },
});
