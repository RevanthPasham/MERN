/**
 * Create first admin user. Run after migration 002.
 * Usage: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret npx ts-node scripts/create-admin.ts
 */
import "dotenv/config";
import { initModels } from "../src/db/models";
import * as adminAuthService from "../src/services/adminAuth.service";

async function run() {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];
  if (!email || !password) {
    console.error("Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... npx ts-node scripts/create-admin.ts");
    console.error("   or: npx ts-node scripts/create-admin.ts admin@example.com secret");
    process.exit(1);
  }
  try {
    await initModels();
    const admin = await adminAuthService.createAdmin(email, password, "Admin");
    console.log("Admin created:", admin.email);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error:", msg);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
