import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as refundRequestService from "../services/refundRequest.service";

/** GET /admin/refund-requests - List all refund requests with order + items + user */
export async function list(_req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const list = await refundRequestService.listRefundRequestsForAdmin();
    return res.json({ success: true, data: list });
  } catch (e) {
    next(e);
  }
}

/** PATCH /admin/refund-requests/:id - Update status (approved | rejected) */
export async function updateStatus(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const status = req.body?.status;
    if (!id) return res.status(400).json({ success: false, error: "ID required" });
    if (status !== "approved" && status !== "rejected")
      return res.status(400).json({ success: false, error: "status must be approved or rejected" });
    const ok = await refundRequestService.updateRefundRequestStatus(id, status);
    if (!ok) return res.status(404).json({ success: false, error: "Refund request not found" });
    return res.json({ success: true, data: { status } });
  } catch (e) {
    next(e);
  }
}
