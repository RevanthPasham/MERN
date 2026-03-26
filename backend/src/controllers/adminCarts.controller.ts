import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as adminCartsService from "../services/adminCarts.service";

export async function list(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminCartsService.listCarts();
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
