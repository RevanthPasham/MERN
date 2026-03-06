/**
 * Create admin user. Run after migrations (002 + 003).
 * Usage:
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... [ADMIN_ROLE=super_admin|admin|sub_admin] npx ts-node scripts/create-admin.ts
 *   npx ts-node scripts/create-admin.ts email@example.com password [Name] [super_admin|admin|sub_admin]
 *
 * Default admin for login: pashamrevanth541@gmail.com / admin (create with role super_admin)
 */
import "dotenv/config";
import { initModels } from "../src/db/models";
import * as adminAuthService from "../src/services/adminAuth.service";
import type { AdminRole } from "../src/db/models/admin.model";

const ROLES: AdminRole[] = ["super_admin", "admin", "sub_admin"];

async function run() {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];
  const name = process.env.ADMIN_NAME || process.argv[4];
  const roleArg = process.env.ADMIN_ROLE || process.argv[5];
  const role: AdminRole = ROLES.includes(roleArg as AdminRole) ? (roleArg as AdminRole) : "admin";

  if (!email || !password) {
    console.error("Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... npx ts-node scripts/create-admin.ts");
    console.error("   or: npx ts-node scripts/create-admin.ts email@example.com password [name] [super_admin|admin|sub_admin]");
    process.exit(1);
  }
  try {
    await initModels();
    const admin = await adminAuthService.createAdmin(email, password, name || "Admin", role);
    console.log("Admin created:", admin.email, "role:", admin.role);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error:", msg);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
