import { Request, Response, NextFunction } from "express";
import * as collectionService from "../services/collection.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await collectionService.list();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await collectionService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await collectionService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: "Collection not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
