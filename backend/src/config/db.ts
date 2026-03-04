import { Sequelize } from "sequelize";

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