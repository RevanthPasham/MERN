import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as adminOrdersService from "../services/adminOrders.service";

export async function list(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const filter = (req.query.filter as string) || "all";
    const data = await adminOrdersService.listOrders(
      ["all", "new", "completed"].includes(filter) ? filter as any : "all"
    );
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getById(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminOrdersService.getOrderById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: "Order not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updateStatus(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const { orderStatus } = req.body;
    const data = await adminOrdersService.updateOrderStatus(
      req.params.id,
      orderStatus || "Processing"
    );
    if (!data) return res.status(404).json({ success: false, error: "Order not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
