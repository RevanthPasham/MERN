import { Request, Response, NextFunction } from "express";
import * as bannerService from "../services/banner.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await bannerService.list();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
