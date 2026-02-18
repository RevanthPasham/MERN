import { Request, Response } from "express";
import { createCategory } from "../services/category.post";

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
