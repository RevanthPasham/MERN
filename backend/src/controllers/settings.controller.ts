import { Request, Response, NextFunction } from "express";
import { sequelize } from "../config/db";

const REFUND_POLICY_KEY = "refund_policy";

/** GET /api/settings/refund-policy - public, for order history display */
export async function getRefundPolicy(_req: Request, res: Response, next: NextFunction) {
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
