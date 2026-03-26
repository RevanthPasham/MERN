import { Request, Response, NextFunction } from "express";
import * as adminInviteService from "../services/adminInvite.service";

/** POST /api/admin/set-password - public (no auth). Accepts token + password from invitation link. */
export async function setPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;
    if (!token || typeof token !== "string" || !token.trim()) {
      return res.status(400).json({ success: false, error: "Token required" });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ success: false, error: "Password required (min 6 characters)" });
    }
    const data = await adminInviteService.setPasswordFromToken(token.trim(), password);
    return res.json({ success: true, data: { admin: data.admin, token: data.token } });
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message?.includes("Invalid or expired")) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next(e);
  }
}
