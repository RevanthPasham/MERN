import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as adminAuthService from "../services/adminAuth.service";

/** GET /admin/admins - List all admins (super_admin only) */
export async function list(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminAuthService.listAdmins();
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

/** DELETE /admin/admins/:id - Remove an admin (super_admin only, cannot remove self) */
export async function remove(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const requestedBy = req.adminId;
    if (!id) return res.status(400).json({ success: false, error: "Admin ID required" });
    if (!requestedBy) return res.status(401).json({ success: false, error: "Unauthorized" });
    await adminAuthService.deleteAdmin(id, requestedBy);
    return res.json({ success: true, message: "Admin removed" });
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message?.includes("cannot remove yourself")) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next(e);
  }
}
