import { Response, NextFunction } from "express";
import { sequelize } from "../config/db";
import type { AdminRequest } from "../middleware/auth";

const REFUND_POLICY_KEY = "refund_policy";

/** GET /admin/settings/refund-policy */
export async function getRefundPolicy(_req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const [rows] = await sequelize.query(
      `SELECT value FROM site_settings WHERE key = :key LIMIT 1`,
      { replacements: { key: REFUND_POLICY_KEY } }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    const value = row && typeof row === "object" && "value" in row ? (row as any).value : null;
    return res.json({ success: true, data: { refundPolicy: value || "" } });
  } catch (e) {
    next(e);
  }
}

/** PATCH /admin/settings/refund-policy - super_admin or sub_admin */
export async function updateRefundPolicy(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const { refundPolicy } = req.body;
    const value = typeof refundPolicy === "string" ? refundPolicy : "";
    await sequelize.query(
      `INSERT INTO site_settings (key, value, updated_at) VALUES (:key, :value, NOW())
       ON CONFLICT (key) DO UPDATE SET value = :value, updated_at = NOW()`,
      { replacements: { key: REFUND_POLICY_KEY, value } }
    );
    return res.json({ success: true, data: { refundPolicy: value } });
  } catch (e) {
    next(e);
  }
}
