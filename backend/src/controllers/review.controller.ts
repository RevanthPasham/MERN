import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/review.service";
import type { AuthRequest } from "../middleware/auth";
import { isValidUUID } from "../utils/uuid";

export const getByProductId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    if (!productId || !isValidUUID(productId)) return res.status(400).json({ success: false, error: "Invalid product id" });
    const data = await reviewService.getByProductId(productId);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const canReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    if (!isValidUUID(productId)) return res.json({ success: true, data: { canReview: false } });
    const userId = req.userId;
    const can = await reviewService.canUserReview(productId, userId);
    res.json({ success: true, data: { canReview: can } });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    if (!productId || !isValidUUID(productId)) return res.status(400).json({ success: false, error: "Invalid product id" });
    const userId = req.userId ?? null;
    const body = req.body as { rating?: number; comment?: string; userName?: string };
    const data = await reviewService.create(
      productId,
      {
        rating: body.rating ?? 5,
        comment: body.comment ?? null,
        userId,
        userName: body.userName ?? null,
      },
      { requirePurchase: true }
    );
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
