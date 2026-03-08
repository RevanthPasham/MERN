import { Request, Response, NextFunction } from "express";
import * as adminSizeChartsService from "../services/adminSizeCharts.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await adminSizeChartsService.listSizeCharts();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const getByCategoryId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await adminSizeChartsService.getByCategoryId(req.params.categoryId);
    if (!data) return res.status(404).json({ success: false, error: "Category or size chart not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const upsert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const body = req.body as { imageUrl?: string | null; description?: string | null };
    const data = await adminSizeChartsService.upsertSizeChart(categoryId, body);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
