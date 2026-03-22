import dns from "node:dns";
import { Sequelize } from "sequelize";

// Force public DNS resolvers so local DNS refusals don't block DB hostname lookups.
const dnsServers = process.env.DNS_SERVERS?.split(",").map((s) => s.trim()).filter(Boolean);
if (dnsServers?.length) {
  dns.setServers(dnsServers);
} else {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}
dns.setDefaultResultOrder("ipv4first");

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL || typeof DATABASE_URL !== "string" || !DATABASE_URL.trim()) {
  throw new Error("DATABASE_URL is missing. Set it in Vercel Environment Variables (or .env locally).");
}

export const sequelize = new Sequelize(DATABASE_URL.trim(), {
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