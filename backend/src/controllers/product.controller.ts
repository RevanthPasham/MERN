import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await productService.list();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await productService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await productService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
