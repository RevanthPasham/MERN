import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/category.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.list();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: "Category not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
