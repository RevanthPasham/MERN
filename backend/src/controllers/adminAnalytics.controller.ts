import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as adminAnalyticsService from "../services/adminAnalytics.service";

export async function get(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminAnalyticsService.getAnalytics();
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function exportExcel(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const csv = await adminAnalyticsService.getExportCsv();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="orders-export-${Date.now()}.csv"`);
    return res.send(csv);
  } catch (e) {
    next(e);
  }
}
