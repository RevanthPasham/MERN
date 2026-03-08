import crypto from "crypto";
import { sequelize } from "../config/db";
import { Admin } from "../db/models";
import * as adminAuthService from "./adminAuth.service";
import * as emailService from "./email.service";

const INVITE_EXPIRY_HOURS = 24;
const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL || process.env.FRONTEND_URL || "http://localhost:5173";

const ALLOWED_ROLES = ["super_admin", "sub_admin", "admin"] as const;

export async function inviteSubAdmin(email: string, role: string = "sub_admin"): Promise<void> {
  const existingAdmin = await Admin.findOne({ where: { email: email.toLowerCase().trim() } });
  if (existingAdmin) throw new Error("Admin with this email already exists");

  const inviteRole = ALLOWED_ROLES.includes(role as any) ? role : "sub_admin";
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

  await sequelize.query(
    `INSERT INTO admin_invitations (email, token, role, expires_at) VALUES (:email, :token, :role, :expiresAt)`,
    {
      replacements: { email: email.toLowerCase().trim(), token, role: inviteRole, expiresAt },
    }
  );

  if (!emailService.isEmailConfigured()) throw new Error("SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.");
  await emailService.sendAdminInvitation(email.trim(), token, `${ADMIN_BASE_URL}/admin` || ADMIN_BASE_URL);
}

export async function setPasswordFromToken(token: string, password: string): Promise<{ admin: { id: string; email: string; name: string | null; role: string }; token: string }> {
  const [rows] = await sequelize.query(
    `SELECT email, role FROM admin_invitations WHERE token = :token AND expires_at > NOW() LIMIT 1`,
    { replacements: { token } }
  );
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row || typeof row !== "object") throw new Error("Invalid or expired invitation link");

  const email = (row as any).email;
  const role = (row as any).role || "sub_admin";

  const admin = await adminAuthService.createAdmin(email, password, undefined, role);
  await sequelize.query(`DELETE FROM admin_invitations WHERE token = :token`, { replacements: { token } });

  const login = await adminAuthService.adminLogin(email, password);
  return login;
}
