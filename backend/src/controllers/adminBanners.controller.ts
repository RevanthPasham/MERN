import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as adminBannersService from "../services/adminBanners.service";

export async function list(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminBannersService.listAll();
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getById(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminBannersService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: "Banner not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function create(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    if (!body?.title || !body?.highlight || !body?.cta || !body?.collectionSlug) {
      return res.status(400).json({
        success: false,
        error: "title, highlight, cta, collectionSlug required",
      });
    }
    const data = await adminBannersService.create(body);
    return res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function update(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminBannersService.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ success: false, error: "Banner not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
