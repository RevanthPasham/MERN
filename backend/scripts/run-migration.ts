/**
 * Run the address/order migration.
 * Usage: npm run db:migrate (from backend folder) or: npx ts-node scripts/run-migration.ts
 */
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { sequelize } from "../src/config/db";

const MIGRATION_FILE = path.join(__dirname, "../src/db/migrations/001_address_and_order_updates.sql");

async function run() {
  if (!fs.existsSync(MIGRATION_FILE)) {
    console.error("Migration file not found:", MIGRATION_FILE);
    process.exit(1);
  }
  const sql = fs.readFileSync(MIGRATION_FILE, "utf8");
  console.log("Running migration...");
  try {
    await sequelize.query(sql);
    console.log("Migration completed successfully.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Migration failed:", msg);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

run();
