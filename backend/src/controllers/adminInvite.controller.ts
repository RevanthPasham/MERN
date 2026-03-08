import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as adminInviteService from "../services/adminInvite.service";

/** POST /admin/invite - super_admin only. Body: { email, role?: 'super_admin'|'sub_admin'|'admin' } */
export async function invite(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const { email, role } = req.body;
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ success: false, error: "Email required" });
    }
    await adminInviteService.inviteSubAdmin(email.trim(), typeof role === "string" ? role : undefined);
    return res.json({ success: true, message: "Invitation sent" });
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message?.includes("already exists")) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err.message?.includes("SMTP not configured")) {
      return res.status(503).json({ success: false, error: err.message });
    }
    next(e);
  }
}
