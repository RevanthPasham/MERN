/**
 * Set an existing admin's role (e.g. to super_admin).
 * Usage:
 *   npx ts-node scripts/set-admin-role.ts <email> <role>
 *   role: super_admin | sub_admin | admin
 *
 * Example: npx ts-node scripts/set-admin-role.ts admin@example.com super_admin
 */
import "dotenv/config";
import { initModels } from "../src/db/models";
import { Admin } from "../src/db/models";
import type { AdminRole } from "../src/db/models/admin.model";

const ROLES: AdminRole[] = ["super_admin", "admin", "sub_admin"];

async function run() {
  const email = process.argv[2];
  const roleArg = process.argv[3];

  if (!email || !roleArg) {
    console.error("Usage: npx ts-node scripts/set-admin-role.ts <email> <role>");
    console.error("  role: super_admin | sub_admin | admin");
    process.exit(1);
  }

  const role = ROLES.includes(roleArg as AdminRole) ? (roleArg as AdminRole) : null;
  if (!role) {
    console.error("Invalid role. Use: super_admin, sub_admin, or admin");
    process.exit(1);
  }

  try {
    await initModels();
    const admin = await Admin.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!admin) {
      console.error("No admin found with email:", email);
      process.exit(1);
    }
    await admin.update({ role });
    console.log("Updated:", admin.email, "-> role:", role);
  } catch (err: unknown) {
    console.error("Error:", err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
