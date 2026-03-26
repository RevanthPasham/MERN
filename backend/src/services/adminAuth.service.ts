import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../db/models";
import type { AdminCreationAttributes, AdminRole } from "../db/models/admin.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-change-in-production";
const ADMIN_JWT_EXPIRY = "7d";
const SALT_ROUNDS = 10;

export function getAdminJwtSecret(): string {
  return JWT_SECRET;
}

export async function adminLogin(email: string, password: string) {
  const admin = await Admin.findOne({ where: { email: email.toLowerCase().trim() } });
  if (!admin) throw new Error("Invalid email or password");
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw new Error("Invalid email or password");
  const token = jwt.sign(
    { adminId: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: ADMIN_JWT_EXPIRY }
  );
  return {
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    token,
  };
}

export async function createAdmin(email: string, password: string, name?: string, role: AdminRole = "admin") {
  const existing = await Admin.findOne({ where: { email: email.toLowerCase().trim() } });
  if (existing) throw new Error("Admin with this email already exists");
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const admin = await Admin.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    name: name || null,
    role: role === "super_admin" || role === "sub_admin" ? role : "admin",
  } as AdminCreationAttributes);
  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}

export async function listAdmins(): Promise<{ id: string; email: string; name: string | null; role: string }[]> {
  const admins = await Admin.findAll({
    attributes: ["id", "email", "name", "role"],
    order: [["email", "ASC"]],
  });
  return admins.map((a) => ({ id: a.id, email: a.email, name: a.name, role: a.role }));
}

export async function deleteAdmin(adminId: string, requestedByAdminId: string): Promise<boolean> {
  if (adminId === requestedByAdminId) throw new Error("You cannot remove yourself");
  const admin = await Admin.findByPk(adminId);
  if (!admin) return false;
  await admin.destroy();
  return true;
}
