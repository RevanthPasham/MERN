/**
 * Run all migrations in backend/src/db/migrations/ (sorted by name).
 * Usage: npm run db:migrate (from backend folder)
 */
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { sequelize } from "../src/config/db";

const MIGRATIONS_DIR = path.join(__dirname, "../src/db/migrations");

async function run() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error("Migrations dir not found:", MIGRATIONS_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, "utf8");
    console.log("Running", file, "...");
    try {
      await sequelize.query(sql);
      console.log(file, "completed.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Migration failed:", msg);
      process.exit(1);
    }
  }
  console.log("All migrations completed successfully.");
  await sequelize.close();
}

run();
